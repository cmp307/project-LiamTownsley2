import { Request, Response } from "express";
import { wrapper } from "..";
import { APIResponse } from "../../../src/interfaces/APIRequests";
import { Collection } from "mongodb";

const express = require('express');
const mongo = require('mongodb');
const router = express.Router();

const DATABASE = "asset-links";

router.get('/', async (_: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const collection: Collection = db.collection(DATABASE);
        const resp = await collection.find({}).toArray();
        return res.send(resp);
    });
});

router.get('/hardware/:id/get-all', async (req: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const collection: Collection = db.collection(DATABASE);
        const id = req.params.id;

        const resp = await collection.find({ hardware_id: new mongo.ObjectId(id) }).toArray();

        let resp_arr = [];
        for (const [i, link] of resp.entries()) {
            const subresp = await db.collection('software').findOne({ _id: link.software_id }) ?? undefined;
            resp_arr.push({
                software: subresp,
                link: resp[i]
            });
        }
        return res.json(resp_arr.filter(x => !!x));
    });
});

router.get('/software/:id/get-all', async (req: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const collection: Collection = db.collection(DATABASE);
        const id = req.params.id;

        const resp = await collection.find({ software_id: new mongo.ObjectId(id) }).toArray();

        let resp_arr = [];
        for (const [i, link] of resp.entries()) {
            const subresp = await db.collection('hardware').findOne({ _id: link.hardware_id }) ?? undefined;
            resp_arr.push({
                hardware: subresp,
                link: resp[i]
            });
        }
        return res.json(resp_arr.filter(x => !!x));
    });
});

router.get('/software/:id', async (req: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const collection: Collection = db.collection(DATABASE);
        const id = req.params.id;

        const resp = await collection.find({ software_id: new mongo.ObjectId(id) }).toArray();
        return res.send(resp);
    });
});

router.delete('/hardware/:hwid/:swid', async (req: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const collection: Collection = db.collection(DATABASE);
        const hwid = req.params.hwid;
        const swid = req.params.swid;

        const resp = await collection.deleteMany({
            hardware_id: new mongo.ObjectId(hwid),
            software_id: new mongo.ObjectId(swid)
        });
        return res.json(resp);
    });
});

router.post('/', async (req: Request, res: Response) => {
    await wrapper(async (db: any) => {
        const { hardware_id, software_id, date, created_by }: APIResponse.CreateAssetLink = req.body as APIResponse.CreateAssetLink;
        const collection: Collection = db.collection(DATABASE);

        const HardwareID = new mongo.ObjectId(hardware_id);
        const SoftwareID = new mongo.ObjectId(software_id)

        const isExisting = await collection.find({
            hardware_id: HardwareID,
            software_id: SoftwareID
        }).toArray()
        
        if (isExisting.length > 0) {
            return res.send({ status: false })
        }

        const _date = new Date(date);
        const resp = await collection.insertOne({
            hardware_id: HardwareID,
            software_id: SoftwareID,
            date: _date,
            created_by
        })

        if (resp.acknowledged) return res.send(resp);
        return res.send({ status: false })
    });
});

export default router;