import Axios from 'axios';

export interface GoUMLResponse {
  compress: string,
}

export const getGoUML = (src: string): Promise<GoUMLResponse> => {
  const promise = new Promise<GoUMLResponse>((resolve, reject) => {
    try {
      Axios
        .post("http://localhost:8080/gouml", {
          src: src,
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
        .then(res => resolve(res.data));
    } catch (e) {
      return reject(e);
    }
  });
  return promise;
}