// This file was partially generated by electron-vite package (2023)
// The automatically generated code will be surrounded by EQUAL signs.
// Generated code starts from line 93 and continues until line 153.

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

const mongo = require('mongodb');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const server = express();

server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

const uri = 'mongodb+srv://uni-project:9rT5qBAsDfGQgGOg@cluster0.vz4azvs.mongodb.net/?retryWrites=true&w=majority';
const client = new mongo.MongoClient(uri);

let database: any;

export async function connectToMongoDB() {
  if (!database) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const _db = client.db('uni-project-dev');

      database = _db;
      return _db;
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  } else {
    console.log('Connected to running MongoDB conn')
    return database;
  }
}

server.get('/api/signup', async (req: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('employees');
  const { first_name, last_name, email, password, department } = req.query;

  bcrypt.hash(password, 10, (err: any, hash: any) => {
    res.send(JSON.stringify(data));
    console.log('password hashed');
    console.log(`${password} -> ${hash}`);
  });
});

server.post('/api/login', async (req: any, res: any) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('employees');

    const body = JSON.parse(Object.keys(req.body)[0]);
    const email = body.email;
    const password = body.password;
    if (!email || !password) throw new Error("Required fields not provided.");
    console.log(`
    Email: ${email}
    Password: ${password}`)
    const data = await collection.findOne({ email });
    console.log(data);
    if (!data) throw new Error("User not found in database.");

    const crypt = await bcrypt.compare(password, data.password);
    if (!crypt) {
      res.status(400)
      return res.json({ status: false })
    }
    return res.json({ status: true })
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.json({ status: false })
  }
});

server.get('/api/assets', async (_: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');

  const data = await collection.find().toArray();
  res.json(data);
});



server.get('/api/asset/:id', async (req: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');
  const id = req.params.id;
  console.log('api/assets/id -> ', id);
  const data = await collection.findOne({ _id: new mongo.ObjectId(id) });
  console.log(data);
  res.json(data);
});

server.get('/api/employees', async (_: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('employees');

  const data = await collection.find().toArray();
  res.json(data);
});

server.get('/api/employee/:id', async (req: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('employees');
  const id = req.params.id;
  console.log('api/employee/id -> ', id);
  const data = await collection.findOne({ _id: new mongo.ObjectId(id) });
  console.log(data);
  res.json(data);
});

server.get('/api/employee/:id/assets', async (req: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');
  const id = req.params.id;
  console.log('api/employee/id -> ', id);
  const data = await collection.find({ employee: new mongo.ObjectId(id) }).toArray();
  console.log(data);
  res.json(data);
});

server.delete('/api/delete-all-assets', async (_: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');

  await collection.deleteMany({});
  res.json({ "status": true });
})

server.delete('/api/assets/:id/delete', async (req: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');
  const id = req.params.id;
  console.log(id)
  await collection.deleteOne({ _id: new mongo.ObjectId(id) });
  res.json({ "status": true });
})


server.get('/api/assets/create', async (req: any, _: any) => {
  console.log(req.query);
  const db = await connectToMongoDB();
  const collection = db.collection('assets');
  const { name, type, model, manufacturer, ip, date, note, employee } = req.query;
  const _employee = new mongo.ObjectId(employee);

  collection.insertOne({
    name,
    type,
    model,
    manufacturer,
    ip,
    date,
    note,
    employee: _employee
  })
})
// ===============================================================
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, 'public', 'vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1500,
    height: 1000,
    show: false
  })

  // win.removeMenu();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.once('ready-to-show', () => {
    win?.show();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  const os = require('os');
  ipcMain.handle('get-data', () => {
    const data = {
      cpu: os.cpus()[0].model
    };
    console.log('ipc data ->',data)
    return data;
  })
  createWindow();
})
// ===============================================================

app.on('ready', () => {
  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})