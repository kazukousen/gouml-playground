import * as React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/golang';
import 'brace/theme/monokai';

interface TextProps {
  source: string
  setSource: React.Dispatch<React.SetStateAction<string>>
}

export const Editor = (props: TextProps) => {

  const onChange = (value: string) => {
    props.setSource(value);
  }

  return (
    <AceEditor
      mode="golang"
      theme="monokai"
      name="editior"
      onChange={onChange}
      fontSize={14}
      value={props.source}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 4,
      }} />
  );
}


const initialText = `package main

type Foo struct {
\tBar Bar
}

type Bar int
`;