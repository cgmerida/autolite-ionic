import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/app/order.service';
import { UserService } from 'src/app/services/user.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend } from 'ng2-charts';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {


  private user: User;

  private totalOrders = 0;
  private loading = true;
  private totalExpenses = 0;


  // IONIC CHART BAR

  public pieChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1.7,
  };
  public pieChartLabels: Label[] = ['Nuevo', 'En Progreso', 'Completado', 'Cancelado'];
  public pieChartData: SingleDataSet = [30, 50, 20, 5];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  chartColors = [
    {
      backgroundColor: (context) => {
        let i = context.dataIndex;
        // let value = context.dataset.data[i];
        let label = context.chart.config.data.labels[i];
        let color = {
          'Nuevo': 'rgba(82, 96, 255,.5)',
          'En Progreso': 'rgba(2, 2, 62,.5)',
          'Completado': 'rgba(45, 211, 111,.5)',
          'Cancelado': 'rgba(235, 68, 90,.5)'

        };
        return color[label];
      }
    },
  ];



  // BARS CHART
  barChartOptions: ChartOptions = {
    responsive: true,
    responsiveAnimationDuration: 1000,
    aspectRatio: 1.7,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        stacked: true
      }],
      yAxes: [{
        display: false,
        stacked: true
      }]
    }
  };

  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];




  constructor(
    private orderServcice: OrderService,
    private userService: UserService,
  ) {
    this.userService.getAuthUser().subscribe(user => {
      this.user = user;
    });


    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {

    this.orderServcice.getCompletedOrders()
      .then(orders$ => {
        orders$.subscribe(orders => {

          orders.forEach(order => {
            this.totalOrders++;
            order.services.forEach(service => {
              this.totalExpenses += Math.round(service.price * 100) / 100;
              if (service.hasOwnProperty('products') && service.products.length > 0) {
                service.products.forEach(product => {
                  this.totalExpenses += Math.round(product.price * 100) / 100;
                });
              }
            })
          })

          this.loading = false;

        })
      });
  }

}
