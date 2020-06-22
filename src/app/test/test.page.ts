import { Component, OnInit } from '@angular/core';


import { Plugins, ActionSheetOptionStyle } from '@capacitor/core';

const { Modals } = Plugins;

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  async showAlert() {
    let alertRet = await Modals.alert({
      title: 'Stop',
      message: 'this is an error'
    });
  }

  async showConfirm() {
    let confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you\'d like to press the red button?'
    });
    console.log('Confirm ret', confirmRet);
  }

  async showPrompt() {
    let promptRet = await Modals.prompt({
      title: 'Hello',
      message: 'What\'s your name?'
    });
    console.log('Prompt ret', promptRet);
  }

  async showActions() {
    let promptRet = await Modals.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Upload'
        },
        {
          title: 'Share'
        },
        {
          title: 'Remove',
          style: ActionSheetOptionStyle.Destructive
        }
      ]
    })
    console.log('You selected', promptRet);
  }



}
