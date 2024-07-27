import { JsonLinter } from '@/components/JsonLinter/JsonLinter';
import { Base64Decoder } from '@/components/Base64Decoder/Base64Decoder';
import { UrlDecoder } from '@/components/UrlDecoder/UrlDecoder';
import { JWTViewer } from '@/components/JWTViewer/JWTViewer';
import { NavbarSimple } from '@/components/Navbar/Navbar';
import { Group, Stack, Text, Container, Title } from '@mantine/core';

import { useState } from 'react';
import { XmlLinter } from '@/components/XmlLinter/XmlLinter';
import { HtmlLinter } from '@/components/HtmlLinter/HtmlLinter';

import { useMantineTheme } from '@mantine/core';
import { InputCompare } from '@/components/InputCompare/InputCompare';
import { EpochDecoder } from '@/components/EpochDecoder/EpochDecoder';
import { JavascriptRunner } from '@/components/JavascriptRunner/JavascriptRunner';

export function HomePage() {

  const [currentView, setCurrentView] = useState(localStorage.getItem("HomePage_currentView") || "JSON Linter");
  const theme = useMantineTheme();

  function setCurrentViewFunction(newView: any) {
    setCurrentView(newView);
    localStorage.setItem("HomePage_currentView", newView);
  }

  function isValidView(newView: any) {
    if (newView === "JSON Linter" || newView === "Base64 Decoder" || newView === "URL Decoder" ||
      newView === "XML Linter" || newView === "HTML Linter" || newView === "JWT Viewer" ||
      newView === "Input Compare" || newView === "Epoch Decoder" || newView === "Javascript Runner") {
      return true;
    }
    return false;
  }

  function getCurrentView() {
    if (isValidView(currentView)) {
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
      else if (currentView === "JWT Viewer") {
        return (<JWTViewer></JWTViewer>)
      }
      else if (currentView === "Input Compare") {
        return (<InputCompare></InputCompare>)
      }
      else if (currentView === "Epoch Decoder") {
        return (<EpochDecoder></EpochDecoder>)
      }
      else if (currentView === "Javascript Runner") {
        return (<JavascriptRunner></JavascriptRunner>)
      }
      return;
    }

    return (<Container style={{ height: '100vh', width: '100%' }}>
      <Title ta='center' mt={100} size='72'>
        <Text inherit variant="gradient" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>
          Coming Soon
        </Text>
      </Title>
    </Container>);
  }

  return (
    <Stack style={{ height: "100vh" }}>
      <Group flex={1}>
        <NavbarSimple currentView={currentView} setCurrentView={setCurrentViewFunction}></NavbarSimple>
        {getCurrentView()}
      </Group>
    </Stack>
  );
}
