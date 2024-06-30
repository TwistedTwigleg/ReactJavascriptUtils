import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, FileInput, Group } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
// TODO - at some point, replace this with 'js-beautify' directly
import pretty from 'pretty';
import { useMantineTheme } from '@mantine/core';

import {
    IconCheck,
    IconNotebook,
    IconWeight,
    IconClipboard,
    IconFile
} from '@tabler/icons-react';

export function HtmlLinter() {

    const [htmlInput, setHtmlInput] = useState('');
    const [htmlOutput, setHtmlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)
    const domParser = new DOMParser();
    const [htmlFileValue, setHtmlFileValue] = useState<File | null>(null);

    const theme = useMantineTheme();

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

    function onFileLoad(value : File | null ) {
        setHtmlFileValue(value);

        if (value !== null) {
            if(!window.FileReader) {
                console.log("ERROR - browser is not compatible to read files!");
                setHtmlInput("Could not read file - browser is not compatible");
                return; // Browser is not compatible
            }
            var reader = new FileReader();
            reader.readAsText(value);
            reader.onloadend = function() {
                let resStr = reader.result?.toString() || "";
                setHtmlInput(resStr);
            }
        }
        else {
            setHtmlInput("");
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(htmlOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    function onDownloadFilePressed() {
        downloadAsFile(htmlOutput, "htmlOutput.html", "text/plain");
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
        <Container fluid flex={1} maw={'100%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>HTML Linter</Text>
            </Title>
            <Text><b>Note:</b> HTML validation is <Text color={theme.colors.grape[5]} span>still under development</Text></Text>

            <Textarea
                description='Place HTML into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={htmlInput}
                onChange={e => setHtmlInput(e.target.value)}>
            </Textarea>

            <Group>
                <Text>Upload file:</Text>
                <FileInput flex={1} value={htmlFileValue} onChange={onFileLoad} placeholder="Click to upload HTML file" clearable>Use File</FileInput>
            </Group>

            <Space h='md'></Space>

            <SimpleGrid cols={3}>
                <Button color='grape' onClick={onParseHTML}><IconCheck/>Validate HTML</Button>
                <Button color='grape' onClick={onPrettyHTML}><IconNotebook/>Prettify HTML</Button>
                <Button color='grape' onClick={onCondeseHTML}><IconWeight/>Condense HTML</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Output</Text>
                <ScrollArea.Autosize mah={300} type='always'>
                    <CodeHighlight code={htmlOutput} language='html' withCopyButton={false}></CodeHighlight>
                </ScrollArea.Autosize>
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onCopyToClipboard} disabled={htmlOutput==''}><IconClipboard/>Copy to clipboard</Button>
                <Button color='grape' onClick={onDownloadFilePressed} disabled={htmlOutput==''}><IconFile/>Save to File</Button>
            </SimpleGrid>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}