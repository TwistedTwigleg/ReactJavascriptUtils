import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, Select, Paper, FileInput, Group } from '@mantine/core';
import { useState, useRef } from 'react';
import { useMantineTheme } from '@mantine/core';
import {
    IconNotebook,
} from '@tabler/icons-react';

import * as diffMatchPatch from 'diff-match-patch-ts'

export function InputCompare() {

    const [leftTextInput, setLeftTextInput] = useState('');
    const [rightTextInput, setRightTextInput] = useState('');
    const [textOutputLeft, setTextOutputLeft] = useState([<Text></Text>]);
    const [textOutputRight, setTextOutputRight] = useState([<Text></Text>]);
    const theme = useMantineTheme();
    const viewportLeftRef = useRef<HTMLDivElement>(null);
    const viewportRightRef = useRef<HTMLDivElement>(null);
    const ignoreNextScroll = useRef(false);
    const [comparisonViewMode, setComparisonViewMode] = useState<string | null>('Show Both Inputs');

    const [inputFileValueLeft, setInputFileValueLeft] = useState<File | null>(null);
    const [inputFileValueRight, setInputFileValueRight] = useState<File | null>(null);

    function onCompareInputs() {
        let dmp = new diffMatchPatch.DiffMatchPatch();

        let mainDiff = dmp.diff_main(leftTextInput, rightTextInput);
        dmp.diff_cleanupSemantic(mainDiff);

        // TODO - add option to add number lines to output comparison

        console.log(mainDiff);

        let resultArrayLeft = [];
        let resultArrayRight = [];
        for (let i = 0; i < mainDiff.length; i++) {
            let textToAdd = mainDiff[i][1];
            let textToAddArray = textToAdd.split("\n");

            if (mainDiff[i][0] === -1) {
                for (let j = 0; j < textToAddArray.length; j++) {
                    if (j === 0) {
                        resultArrayLeft.push(<Text span color='red'>{textToAddArray[j]}</Text>);
                    } else {
                        resultArrayLeft.push(<Text span color='red'><br/>{textToAddArray[j]}</Text>);
                    }
                }
            }
            else if (mainDiff[i][0] === 1) {
                for (let j = 0; j < textToAddArray.length; j++) {
                    if (j === 0) {
                        resultArrayRight.push(<Text span color='green'>{textToAddArray[j]}</Text>);
                    } else {
                        resultArrayRight.push(<Text span color='green'><br/>{textToAddArray[j]}</Text>);
                    }
                }
            }
            else {
                for (let j = 0; j < textToAddArray.length; j++) {
                    if (j === 0) {
                        resultArrayLeft.push(<Text span>{textToAddArray[j]}</Text>);
                        resultArrayRight.push(<Text span>{textToAddArray[j]}</Text>);
                    } else {
                        resultArrayLeft.push(<Text span><br/>{textToAddArray[j]}</Text>);
                        resultArrayRight.push(<Text span><br/>{textToAddArray[j]}</Text>);
                    }
                }
            }
        }
        setTextOutputLeft(resultArrayLeft);
        setTextOutputRight(resultArrayRight);
    }

    function onLeftScrollPositionChange(_scrollPos : any) {
        if (ignoreNextScroll.current === true) {
            ignoreNextScroll.current = false;
            return;
        }
        ignoreNextScroll.current = true;
        let currentScrollTop = viewportLeftRef.current?.scrollTop || 0;
        let currentScrollHeight = viewportLeftRef.current?.scrollHeight || 0;
        let currentScrollClientHeight = viewportLeftRef.current?.clientHeight || 0;
        let scrollPercentage = (currentScrollTop / (currentScrollHeight - currentScrollClientHeight));

        let otherScrollHeight = viewportRightRef.current?.scrollHeight || 0;
        let otherScrollClientHeight = viewportRightRef.current?.clientHeight || 0;

        if (viewportRightRef.current) {
            viewportRightRef.current!.scrollTo({top: scrollPercentage * (otherScrollHeight - otherScrollClientHeight), behavior: "instant"});
        }
    }
    function onRightScrollPositionChange(_scrollPos : any) {
        if (ignoreNextScroll.current === true) {
            ignoreNextScroll.current = false;
            return;
        }
        ignoreNextScroll.current = true;
        let currentScrollTop = viewportRightRef.current?.scrollTop || 0;
        let currentScrollHeight = viewportRightRef.current?.scrollHeight || 0;
        let currentScrollClientHeight = viewportRightRef.current?.clientHeight || 0;
        let scrollPercentage = (currentScrollTop / (currentScrollHeight - currentScrollClientHeight));

        let otherScrollHeight = viewportLeftRef.current?.scrollHeight || 0;
        let otherScrollClientHeight = viewportLeftRef.current?.clientHeight || 0;

        if (viewportLeftRef.current) {
            viewportLeftRef.current.scrollTo({top: scrollPercentage * (otherScrollHeight - otherScrollClientHeight), behavior: "instant"});
        }
    }

    function getOutputComparisonView() {
        if (comparisonViewMode === "Show Both Inputs") {
            return (<SimpleGrid cols={2}>
                <Paper shadow="sm" withBorder p="xl">
                    <ScrollArea.Autosize mah={300} type='always' onScrollPositionChange={onLeftScrollPositionChange} viewportRef={viewportLeftRef}>        
                        {textOutputLeft}
                    </ScrollArea.Autosize>
                </Paper>

                <Paper shadow="sm" withBorder p="xl">
                    <ScrollArea.Autosize mah={300} type='always' onScrollPositionChange={onRightScrollPositionChange} viewportRef={viewportRightRef}>
                        {textOutputRight}
                    </ScrollArea.Autosize>
                </Paper>
            </SimpleGrid>);
        }
        else if (comparisonViewMode === "Show Left Input") {
            return (<SimpleGrid cols={1}>
                <Paper shadow="sm" withBorder p="xl">
                    <ScrollArea.Autosize mah={300} type='always' onScrollPositionChange={onLeftScrollPositionChange} viewportRef={viewportLeftRef}>        
                        {textOutputLeft}
                    </ScrollArea.Autosize>
                </Paper>
            </SimpleGrid>);
        }
        else if (comparisonViewMode === "Show Right Input") {
            return (<SimpleGrid cols={1}>
                <Paper shadow="sm" withBorder p="xl">
                    <ScrollArea.Autosize mah={300} type='always' onScrollPositionChange={onRightScrollPositionChange} viewportRef={viewportRightRef}>
                        {textOutputRight}
                    </ScrollArea.Autosize>
                </Paper>
            </SimpleGrid>);
        }
        else {
            return (<Text>ERROR - unknown view!</Text>);
        }
    }

    function onFileLoadLeft(value : File | null ) {
        setInputFileValueLeft(value);

        if (value !== null) {
            if(!window.FileReader) {
                console.log("ERROR - browser is not compatible to read files!");
                setLeftTextInput("Could not read file - browser is not compatible");
                return; // Browser is not compatible
            }
            var reader = new FileReader();
            reader.readAsText(value);
            reader.onloadend = function() {
                let resStr = reader.result?.toString() || "";
                setLeftTextInput(resStr);
            }
        }
        else {
            setLeftTextInput("");
        }
    }
    function onFileLoadRight(value : File | null ) {
        setInputFileValueRight(value);

        if (value !== null) {
            if(!window.FileReader) {
                console.log("ERROR - browser is not compatible to read files!");
                setRightTextInput("Could not read file - browser is not compatible");
                return; // Browser is not compatible
            }
            var reader = new FileReader();
            reader.readAsText(value);
            reader.onloadend = function() {
                let resStr = reader.result?.toString() || "";
                setRightTextInput(resStr);
            }
        }
        else {
            setRightTextInput("");
        }
    }

    return (
        <Container fluid flex={1} maw={'100%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>Input Compare</Text>
            </Title>

            <SimpleGrid cols={2}>
                <Textarea
                    description='Place left (red) input into field below'
                    autosize
                    minRows={10}
                    maxRows={20}
                    value={leftTextInput}
                    onChange={e => setLeftTextInput(e.target.value)}>
                </Textarea>
                <Textarea
                    description='Place right (green) input into field below'
                    autosize
                    minRows={10}
                    maxRows={20}
                    value={rightTextInput}
                    onChange={e => setRightTextInput(e.target.value)}>
                </Textarea>
            </SimpleGrid>

            <Group>
                <Text>Upload file:</Text>
                <FileInput flex={1} value={inputFileValueLeft} onChange={onFileLoadLeft} placeholder="Click to upload file" clearable>Use File</FileInput>
                <Text>Upload file:</Text>
                <FileInput flex={1} value={inputFileValueRight} onChange={onFileLoadRight} placeholder="Click to upload file" clearable>Use File</FileInput>
            </Group>

            <Space h='md'></Space>

            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onCompareInputs}><IconNotebook/>Compare Files</Button>
                <Select value={comparisonViewMode} onChange={setComparisonViewMode} allowDeselect={false} data={["Show Both Inputs", "Show Left Input", "Show Right Input"]}></Select>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Comparison:</Text>
            {getOutputComparisonView()}

            <Space h='md'></Space>
            <Text><b>Note: </b>Uses <a href='https://github.com/google/diff-match-patch'>diff-match-patch</a> to compare, which is licensed under <a href='https://github.com/google/diff-match-patch/blob/master/LICENSE'>Apache License 2.0.</a></Text>
        </Container>
    );

}