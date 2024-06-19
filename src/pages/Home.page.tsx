import { JsonLinter } from '@/components/JsonLinter/JsonLinter';
import { Base64Decoder } from '@/components/Base64Decoder/Base64Decoder';
import { UrlDecoder } from '@/components/UrlDecoder/UrlDecoder';
import { NavbarSimple } from '@/components/Navbar/Navbar';
import { Group, Stack, Text, Container, Title } from '@mantine/core';

import { useState } from 'react';
import { XmlLinter } from '@/components/XmlLinter/XmlLinter';
import { HtmlLinter } from '@/components/HtmlLinter/HtmlLinter';

export function HomePage() {

  const [currentView, setCurrentView] = useState("JSON Linter");

  function getCurrentView() {
    if (currentView === "JSON Linter") {
      return (<JsonLinter></JsonLinter>);
    }
    else if (currentView === "Base64 Decoder") {
      return (<Base64Decoder></Base64Decoder>);
    }
    else if (currentView === "URL Decoder") {
      return (<UrlDecoder></UrlDecoder>)
    }
    else if (currentView === "XML Linter") {
      return (<XmlLinter></XmlLinter>)
    }
    else if (currentView === "HTML Linter") {
      return (<HtmlLinter></HtmlLinter>)
    }
    else {
      return (<Container style={{height: '100vh', width: '100%'}}><Title ta='center' mt={100} size='72'>Coming Soon</Title></Container>);
    }
  }

  return (
    <Stack style={{ height: "100vh" }}>
      <Group>
        <NavbarSimple currentView={currentView} setCurrentView={setCurrentView}></NavbarSimple>
        {getCurrentView()}
      </Group>
    </Stack>
  );
}
