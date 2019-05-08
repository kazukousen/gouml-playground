import * as React from 'react';

import { GoUMLResponse, getGoUML } from '../api/gouml';

interface PreviewerProps {
  source: string
}

export const PreviewerComponent = (props: PreviewerProps) => {
  const { umlState, loadUMLState } = useUMLState();

  loadUMLState(props.source);

  return (
    <img src={umlState.compress} className="" alt="" />
  );
}

const useUMLState = () => {
  const [umlState, setUMLState] = React.useState<GoUMLResponse>({ compress: "" });

  const loadUMLState = (src: string) => {
    getGoUML(src).then(gouml => setUMLState(gouml));
  }

  return { umlState, loadUMLState };
}
