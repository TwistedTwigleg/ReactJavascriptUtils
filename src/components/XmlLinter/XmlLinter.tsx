import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, Code } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';

export function XmlLinter() {

    const [xmlInput, setXmlInput] = useState('');
    const [xmlOutput, setXmlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

    const domParser = new DOMParser();

    // XML Pretty print credit:
    // https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
    function prettyPrintXML(xml : any, tab = "\t") { // tab = optional indent value, default is tab (\t)
        var formatted = '', indent= '';
        tab = tab || '\t';
        xml.split(/>\s*</).forEach(function(node : any) {
            if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
            formatted += indent + '<' + node + '>\r\n';
            if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
        });
        return formatted.substring(1, formatted.length-3);
    }
    function condensePrintXML(xml : any) {
        var formatted = '';
        xml.split(/>\s*</).forEach(function(node : any) {
            formatted += '<' + node + '>';
        });
        return formatted.substring(1, formatted.length-1);
    }

    function onParseXML() {
        try {
            const doc = domParser.parseFromString(xmlInput, "application/xml");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setXmlOutput("");
            } else {
                setStatusText((<Text span color='green'>XML is valid</Text>));
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setXmlOutput("");
            }
            else {
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{JSON.stringify(error)}</Text></>));
                setXmlOutput("");
            }
        }
    }

    function onPrettyXML() {
        try {
            const doc = domParser.parseFromString(xmlInput, "application/xml");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setXmlOutput("");
            } else {
                setStatusText((<Text span color='green'>XML is valid</Text>));

                const serializer = new XMLSerializer();
                let xmlStr = serializer.serializeToString(doc);
                xmlStr = prettyPrintXML(xmlStr, "\t");
                setXmlOutput(xmlStr);
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setXmlOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{error.message}</Text></>));
                setXmlOutput("");
            }
        }
    }

    function onCondeseXML() {
        try {
            const doc = domParser.parseFromString(xmlInput, "application/xml");
            // print the name of the root element or error message
            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{errorNode.textContent}</Text></>));
                setXmlOutput("");
                setXmlOutput("");
            } else {
                setStatusText((<Text span color='green'>XML is valid</Text>));
                const serializer = new XMLSerializer();
                let xmlStr = serializer.serializeToString(doc);
                xmlStr = condensePrintXML(xmlStr);
                setXmlOutput(xmlStr);
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setXmlOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>XML is invalid</Text><br /><Text span>{error.message}</Text></>));
                setXmlOutput("");
            }
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(xmlOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: 'rgb(255, 142, 243)', to: 'rgb(142, 255, 255)' }}>XML Linter</Text>
            </Title>

            <Textarea
                description='Place XML into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={xmlInput}
                onChange={e => setXmlInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={3}>
                <Button color='grape' onClick={onParseXML}>Validate XML</Button>
                <Button color='grape' onClick={onPrettyXML}>Prettify XML</Button>
                <Button color='grape' onClick={onCondeseXML}>Condense XML</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>
            <Button color='grape' onClick={onCopyToClipboard}>Copy to clipboard</Button>
            <ScrollArea.Autosize mah={300} type='always' offsetScrollbars>
                <CodeHighlight code={xmlOutput} language='xml' withCopyButton={false}></CodeHighlight>
            </ScrollArea.Autosize>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}