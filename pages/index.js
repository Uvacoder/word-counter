// lol this whole thing probably could be done in react but ssr go brrr

import Head from "next/head"
import {useEffect, useState} from "react"
import {
    Page,
    Textarea,
    Text,
    Link,
    Grid,
    Spacer,
    Button,
    useToasts,
    useClipboard,
    Toggle,
    Col,
    User,
    Note,
    Row
} from "@geist-ui/react"
import {Copy, Download, Github} from "@geist-ui/react-icons"

const center = {textAlign: "center"}
import {
    getTheme,
    saveStats,
    getTextFromStorage,
    getStatsFromStorage,
    saveText
} from "../lib"
export default function Home({currentTheme, themeToggle}) {
    const [, setToast] = useToasts()
    const {copy} = useClipboard()
    useEffect(() => {
        const newText = getTextFromStorage()
        if (newText) setText(newText)

        const newStats = getStatsFromStorage()
        if (newStats) setStats(newStats)
        else if (!newStats && newText) {
            const newStats = {
                chars: newText.length,
                // i love/hate regex but its kinda cool when it works.
                // s/o https://regexr.com/
                words: ((newText.split(/([\S])+/) || []).length - 1) / 2,
                sentences: (newText.split(/(!+|\?+|\.+)/).length - 1) / 2
            }
            setStats(newStats)
            saveStats(newStats)
        }
    }, [])

    const [text, setText] = useState("")
    const [textStats, setStats] = useState({
        chars: 0,
        words: 0,
        sentences: 0
    })
    function onChange(e) {
        const temp = e.target.value
        setText(temp)
        saveText(temp)

        // const tmp = temp.split(/([A-z])+/) || []
        const tmp = temp.split(/([\S])+/) || []
        const newStats = {
            chars: temp.length,
            // i love/hate regex but its kinda cool when it works.
            // s/o https://regexr.com/
            words: (tmp.length - 1) / 2,
            sentences: (temp.split(/(!+|\?+|\.+)/).length - 1) / 2
        }
        setStats(newStats)
        saveStats(newStats)
    }

    return (
        <Page dotBackdrop={getTheme() === "light"}>
            <Head>
                <title>Word Counter</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap"
                    rel="stylesheet"
                />
                <meta name="title" content="Word Counter" />
                <meta
                    name="description"
                    content="Keep track of your document's word count!"
                />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://wc.jasonaa.me/" />
                <meta property="og:title" content="Word Counter" />
                <meta
                    property="og:description"
                    content="Keep track of your document's word count!"
                />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_META_IMG} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://wc.jasonaa.me/" />
                <meta property="twitter:title" content="Word Counter" />
                <meta
                    property="twitter:description"
                    content="Keep track of your document's word count!"
                />
                <meta
                    property="twitter:image"
                    content={process.env.NEXT_PUBLIC_META_IMG}
                />
            </Head>
            <Col align="middle">
                <Page.Header>
                    <Text style={center} h1>
                        Word Count.
                    </Text>
                    <Text p style={center}>
                        Enter your text below and see your current word count! Don&apos;t
                        worry about saving - text will auto-save to your browser&apos;s
                        storage after every edit.
                    </Text>
                </Page.Header>
                <Page.Content style={{padding: "calc(1pt * 2.5) 0"}}>
                    <Textarea
                        status="success"
                        id="textarea"
                        onChange={onChange}
                        value={text}
                        width="100%"
                        minHeight="30em"
                        placeholder="Enter your text here."
                    />
                    <Grid.Container alignItems="center" justify="space-evenly">
                        <Grid xs>
                            <Info noun="character" no={textStats.chars}></Info>
                        </Grid>
                        <Grid xs>
                            <Info noun="word" no={textStats.words}></Info>
                        </Grid>
                        <Grid xs>
                            <Info noun="sentence" no={textStats.sentences}></Info>
                        </Grid>
                    </Grid.Container>

                    <Grid.Container alignItems="center" justify="space-evenly">
                        <Button
                            icon={<Copy />}
                            auto
                            onClick={() => {
                                copy(text)
                                setToast({
                                    text: "Text copied.",
                                    type: "success"
                                })
                            }}>
                            Copy to Clipboard
                        </Button>
                        <Button
                            icon={<Download />}
                            auto
                            onClick={() => {
                                // Credit to https://www.codegrepper.com/code-examples/javascript/javascript+download+text+as+txt+file for this snippet
                                const element = document.createElement("a")
                                element.setAttribute(
                                    "href",
                                    "data:text/plain;charset=utf-8," +
                                        encodeURIComponent(text)
                                )
                                element.setAttribute("download", "wordcounter")
                                element.click()
                            }}>
                            Download Text File
                        </Button>
                        <Note
                            small
                            type="secondary"
                            label={"Theme"}
                            style={{marginTop: "1em", width: "10em"}}>
                            <Spacer y={0.5} />
                            <Toggle
                                name="Dark Mode"
                                onChange={themeToggle}
                                initialChecked={currentTheme !== "light"}
                            />
                        </Note>
                    </Grid.Container>
                </Page.Content>

                <Row justify="center" style={{margin: "1em"}}>
                    <User
                        src="https://gravatar.com/avatar/d35776f3bec9c6459903f6a3204b63e4"
                        name="Built by">
                        <User.Link href="https://github.com/jasonappah">
                            @jasonappah
                        </User.Link>
                    </User>
                    <Link href="https://github.com/jasonappah/wordcounter">
                        <Button iconRight={<Github />} auto />
                    </Link>
                </Row>
            </Col>
        </Page>
    )
}

function Info({noun, no}) {
    return (
        <Text p b style={{...center, width: "100%"}}>
            {no || 0} {noun || ""}
            {no === 1 ? "" : "s"}.
        </Text>
    )
}
