const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");

app.use(multer().none());

const notesFile = "notes.json";

function readNotesFromFile() {
    try {
        const data = fs.readFileSync(notesFile);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeNotesToFile(data) {
    fs.writeFileSync(notesFile, JSON.stringify(data, null, 2));
}

const notes = readNotesFromFile();

app.get('/', (req, res) => {
    res.send(`<h1>Запити:</h1>
            1. /notes<b1>
            2. /UploadForm.html<b1>
            3. /notes/<note_name><b1>`);
})

app.get('/notes', (req, res) => {
res.json({ notes });
})

app.get('/UploadForm.html', (req, res) => {
    const path = (__dirname + '/static/UploadForm.html');
    res.sendFile(path);
})

app.post('/upload', (req, res) => {
    const noteName = req.body.note_name;
    const note = req.body.note;
   
    const existing = notes.find(note => note.note_name === noteName);

    if(existing){
        res.status(400).send("Note already exists.");
    }else{
        notes.push({ note_name: noteName, note: note });
        writeNotesToFile(notes)
        res.status(201).send("Note added successfully!");
    }
})

app.get('/notes/:note_name', (req, res) => {
    const note_name = req.params.note_name;
    const findNotes = notes.find(note => note.note_name === note_name);

    if(findNotes)
    {
        res.send(findNotes.note);
    } else{
        res.status(404).json("Note not found(");
    }
})

/*app.put('/notes/:note_name', (req, res) => {
    const noteName = req.params.note_name;
    const notebody = req.body.note;
    const findNoteIndex = notes.findIndex(note => note.note_name === noteName);

    if (findNoteIndex!=-1) {
        notes[findNoteIndex].note = notebody;
        writeNotesToFile(notes);
        res.json({ note_name: noteName, note: notebody });
    } else {
        res.status(404).send("Note not found(");
    }
});*/
app.put("/notes/:note_name", /*upload.none()*/ express.text(), (req, res) => {
    console.log("Params:", req.params)
    console.log("Body:", req.body)
    res.sendStatus(200);
})

app.delete('/notes/:note_name', (req, res) => {
    const noteName = req.params.note_name;
    const findNoteIndex = notes.findIndex(note => note.note_name === noteName);

    if (findNoteIndex !== -1) {
        notes.splice(findNoteIndex, 1);
        writeNotesToFile(notes);
        res.send(`Note ${noteName} was deleted`);
    } else {
        res.status(404).send("Note not found(");
    }
});


app.listen(8000);
