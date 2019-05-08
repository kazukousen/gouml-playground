package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"go/types"
	"io/ioutil"
	"net/http"

	"github.com/kazukousen/gouml"
	"golang.org/x/xerrors"
)

type input struct {
	Src string `json:"src"`
}

func parse(payload *input) (string, error) {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, "", payload.Src, parser.ParseComments)
	if err != nil {
		return "", err
	}
	conf := types.Config{}
	pkg, err := conf.Check("main", fset, []*ast.File{f}, nil)
	if err != nil {
		return "", err
	}

	p := gouml.PlantUMLParser()
	p.Build([]*types.Package{pkg})

	buf := &bytes.Buffer{}
	p.WriteTo(buf)
	return gouml.Compress(buf.String()), nil
}

func handle(w http.ResponseWriter, r *http.Request) {
	// cors
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if origin := r.Header.Get("Origin"); len(origin) > 0 {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Origin", origin)
	} else {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, xerrors.Errorf("could not read request body: %w", err).Error(), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	fmt.Printf("request body: %s\n", body)

	in := &input{}
	if err := json.Unmarshal(body, in); err != nil {
		http.Error(w, xerrors.Errorf("counld not decode JSON from request body: %w", err).Error(), http.StatusInternalServerError)
		return
	}

	content, err := parse(in)
	if err != nil {
		http.Error(w, xerrors.Errorf("counld not parse by gouml: %w", err).Error(), http.StatusInternalServerError)
		return
	}

	out := &output{
		Compress: fmt.Sprintf("http://plantuml.com/plantuml/svg/%s", content),
	}

	b, err := json.Marshal(out)
	if err != nil {
		http.Error(w, xerrors.Errorf("counld not encode JSON: %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

type output struct {
	Compress string `json:"compress"`
}

func main() {
	http.Handle("/gouml", http.HandlerFunc(handle))

	http.ListenAndServe(":8080", nil)
}
