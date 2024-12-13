import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from 'express';
import { get } from "http";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService:AppService) {}
//     @Get()
//     getUsers() {
//         return {name :'lokesh', email: '@@lokesh'}
//     }
    
// @Post()
// store(@Req() req:Request){
//     return req.body;
// }

// @Get('/:userid')
// getUser(@Param()  userid: number){
//     return userid;
// }

    
}