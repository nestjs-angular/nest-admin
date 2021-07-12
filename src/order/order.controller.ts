import { ClassSerializerInterceptor, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { Order } from './models/order.entity';
import { OrderItem } from './models/order-item.entity';
import { HasPermission } from '../permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {

    constructor(
        private orderService: OrderService
    ){}

    @Get('orders')
    @HasPermission('orders')
    async all(@Query('page') page: number = 1) {
        return this.orderService.paginate(page, ['order_items'])
    }

    @Post('export')
    @HasPermission('orders')
    async export(@Res() res: Response  ) {
        const parser = new Parser({
            fields: ['ID', 'Nombre', 'Correo', 'Titulo de producto', 'Precio', 'Cantidad']
        });

        const orders = await this.orderService.all(['order_items']);
        const json = [];

        orders.forEach((o: Order) => {
            json.push({
                ID: o.id,
                Nombre: o.name,
                Correo: o.email,
                'Título producto': '',
                Precio: '',
                Cantidad: ''
            });

            o.order_items.forEach((i: OrderItem) => {
                json.push({
                    ID: '',
                    Nombre: '',
                    Correo: '',
                    'Título producto': i.product_title,
                    Precio: i.price,
                    Cantidad: i.quantity
                });    
            })
        });

        const csv = parser.parse(json);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }

    @Get('chart')
    @HasPermission('orders')
    async chart() {
        return this.orderService.chart();
    }   
}
