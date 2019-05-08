import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { PreviewerComponent } from './components/previewer';
import { Editor } from './components/editor';

export const App = () => {
  const [source, setSource] = React.useState<string>(initialSource);

  return (
    <Container>
      <Row>
        <Col>
          <Editor source={source} setSource={setSource} />
        </Col>
        <Col>
          <PreviewerComponent source={source} />
        </Col>
      </Row>
    </Container>
  )
}

const initialSource = `package main

type Foo struct {
\tBar Bar
}

type Bar int
`;
