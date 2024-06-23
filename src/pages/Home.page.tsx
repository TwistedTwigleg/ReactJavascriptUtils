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

export function HomePage() {

  const [currentView, setCurrentView] = useState("JSON Linter");
  const theme = useMantineTheme();

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
    else if (currentView === "JWT Viewer") {
      return (<JWTViewer></JWTViewer>)
    }
    else {
      return (<Container style={{height: '100vh', width: '100%'}}>
                <Title ta='center' mt={100} size='72'>
                  <Text inherit variant="gradient" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>
                    Coming Soon
                  </Text>
                </Title>
              </Container>);
    }
  }

  return (
    <Stack style={{ height: "100vh" }}>
      <Group flex={1}>
        <NavbarSimple currentView={currentView} setCurrentView={setCurrentView}></NavbarSimple>
        {getCurrentView()}
      </Group>
    </Stack>
  );
}
