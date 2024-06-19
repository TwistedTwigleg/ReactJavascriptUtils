import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, Code } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
// TODO - at some point, replace this with 'js-beautify' directly
import pretty from 'pretty';

export function HtmlLinter() {

    const [htmlInput, setHtmlInput] = useState('');
    const [htmlOutput, setHtmlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)
    const domParser = new DOMParser();

    function onParseHTML() {
        try {
            const doc = domParser.parseFromString(htmlInput, "text/html");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setHtmlOutput("");
            } else {
                setStatusText((<Text span color='green'>HTML is valid</Text>));
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setHtmlOutput("");
            }
            else {
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{JSON.stringify(error)}</Text></>));
                setHtmlOutput("");
            }
        }
    }

    function onPrettyHTML() {
        try {
            const doc = domParser.parseFromString(htmlInput, "text/html");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setHtmlOutput("");
            } else {
                setStatusText((<Text span color='green'>HTML is valid</Text>));
                let prettyString = pretty(htmlInput);
                setHtmlOutput(prettyString);
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setHtmlOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{error.message}</Text></>));
                setHtmlOutput("");
            }
        }
    }

    function onCondeseHTML() {
        try {

            function formatHtml(xml : any) {
                var formatted = '';
                xml.split(/>\s*</).forEach(function(node : any) {
                    formatted += '<' + node + '>';
                });
                return formatted.substring(1, formatted.length-1);
            }

            const doc = domParser.parseFromString(htmlInput, "text/html");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setHtmlOutput("");
            } else {
                setStatusText((<Text span color='green'>HTML is valid</Text>));
                let htmlStr = formatHtml(htmlInput);
                setHtmlOutput(htmlStr);
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setHtmlOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>HTML is invalid</Text><br /><Text span>{error.message}</Text></>));
                setHtmlOutput("");
            }
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(htmlOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: 'rgb(255, 142, 243)', to: 'rgb(142, 255, 255)' }}>HTML Linter</Text>
            </Title>

            <Textarea
                description='Place HTML into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={htmlInput}
                onChange={e => setHtmlInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={3}>
                <Button color='grape' onClick={onParseHTML}>Validate HTML</Button>
                <Button color='grape' onClick={onPrettyHTML}>Prettify HTML</Button>
                <Button color='grape' onClick={onCondeseHTML}>Condense HTML</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>
            <Button color='grape' onClick={onCopyToClipboard}>Copy to clipboard</Button>
            <ScrollArea.Autosize mah={300} type='always' offsetScrollbars>
                <CodeHighlight code={htmlOutput} language='html' withCopyButton={false}></CodeHighlight>
            </ScrollArea.Autosize>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}