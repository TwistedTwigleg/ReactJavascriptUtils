import { Group, Code, Text, Space, Button } from '@mantine/core';
import {
    IconJson,
    IconLockOpen,
    IconKey,
    IconBook,
    IconFileTypeXml,
    IconHtml,
    IconFileCode2,
    IconArrowBarLeft,
    IconArrowBarRight
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useState } from 'react';

const data = [
    { link: '', label: 'JSON Linter', icon: IconJson },
    { link: '', label: 'XML Linter', icon: IconFileTypeXml },
    { link: '', label: 'HTML Linter', icon: IconHtml },
    { link: '', label: 'Base64 Decoder', icon: IconLockOpen },
    { link: '', label: 'URL Decoder', icon: IconFileCode2 },
    { link: '', label: 'JWT Viewer', icon: IconKey },
    { link: '', label: 'Input Compare', icon: IconBook }
];

export function NavbarSimple(props : any) {

    const [collapsed, setCollapsed] = useState(false);
    function toggleCollapse() {
        setCollapsed(!collapsed);
    }

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === props.currentView || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                props.setCurrentView(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    const linksCollapse = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === props.currentView || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                props.setCurrentView(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} style={{flex: 1, margin: 0, marginRight: 0}} />
        </a>
    ));

    if (collapsed === false) {
        return (
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <Group>
                            <Button color='pink' onClick={toggleCollapse}><IconArrowBarLeft/></Button>
                            <Text>Javascript Utils</Text>
                        </Group>
                        <Code fw={700}>v1.5.0</Code>
                    </Group>
                    {links}
                </div>

                <div className={classes.footer}>
                    <Space h='md'></Space>
                    <Text size='xs'>Website Theme</Text>
                    <Space h='xs'></Space>
                    <ColorSchemeToggle></ColorSchemeToggle>
                    <Space h='md'></Space>
                    <Text size='xs'>Created by <a href='https://twistedtwigleg.itch.io/'>TwistedTwigleg</a></Text>
                </div>
            </nav>
        );
    }
    else {
        return (
            <nav className={classes.navbar} style={{width: '90px'}}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <Group>
                            <Button color='pink' onClick={toggleCollapse} flex={1}><IconArrowBarRight/></Button>
                        </Group>
                    </Group>
                    {linksCollapse}
                </div>
            </nav>
        );
    }
}