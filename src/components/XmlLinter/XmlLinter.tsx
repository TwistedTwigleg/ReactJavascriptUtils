import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, FileInput, Group } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconCheck,
    IconNotebook,
    IconWeight,
    IconClipboard,
    IconFile
} from '@tabler/icons-react';

export function XmlLinter() {

    const [xmlInput, setXmlInput] = useState('');
    const [xmlOutput, setXmlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)
    const [xmlFileValue, setXmlFileValue] = useState<File | null>(null);

    const domParser = new DOMParser();

    const theme = useMantineTheme();

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

    function onFileLoad(value : File | null ) {
        setXmlFileValue(value);

        if (value !== null) {
            if(!window.FileReader) {
                console.log("ERROR - browser is not compatible to read files!");
                setXmlInput("Could not read file - browser is not compatible");
                return; // Browser is not compatible
            }
            var reader = new FileReader();
            reader.readAsText(value);
            reader.onloadend = function() {
                let resStr = reader.result?.toString() || "";
                setXmlInput(resStr);
            }
        }
        else {
            setXmlInput("");
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(xmlOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    function onDownloadFilePressed() {
        downloadAsFile(xmlOutput, "xmlOutput.xml", "text/plain");
    }
    function downloadAsFile(data : any, filename : string, type : string) {
        // CREDIT: https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
        var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    return (
        <Container fluid flex={1} maw={'86%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>XML Linter</Text>
            </Title>

            <Textarea
                description='Place XML into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={xmlInput}
                onChange={e => setXmlInput(e.target.value)}>
            </Textarea>

            <Group>
                <Text>Upload file:</Text>
                <FileInput flex={1} value={xmlFileValue} onChange={onFileLoad} placeholder="Click to upload XML file" clearable>Use File</FileInput>
            </Group>

            <Space h='md'></Space>

            <SimpleGrid cols={3}>
                <Button color='grape' onClick={onParseXML}><IconCheck/>Validate XML</Button>
                <Button color='grape' onClick={onPrettyXML}><IconNotebook/>Prettify XML</Button>
                <Button color='grape' onClick={onCondeseXML}><IconWeight/>Condense XML</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Output</Text>
                <ScrollArea.Autosize mah={300} type='always'>
                    <CodeHighlight code={xmlOutput} language='xml' withCopyButton={false}></CodeHighlight>
                </ScrollArea.Autosize>
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onCopyToClipboard} disabled={xmlOutput==''}><IconClipboard/>Copy to clipboard</Button>
                <Button color='grape' onClick={onDownloadFilePressed} disabled={xmlOutput==''}><IconFile/>Save to File</Button>
            </SimpleGrid>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}