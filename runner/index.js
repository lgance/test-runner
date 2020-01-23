
const { wait, loginCheck} = require('@utils');
const puppeteer = require('puppeteer');

const puppeteerOptions = {
  headless:true,
  ignoreHTTPSErros:true,
  defaultViewport :null,
  args: ['--start-maximized']
  // slowMo :5,
}
const testPlatForm = {
  "FIN":process.env.FIN,
  "FIN_BETA":process.env.FIN_BETA,
  "GOV":process.env.GOV,
  "GOV_BETA":process.env.GOV_BETA,
  "PU":process.env.PU,
  "PU_BETA":process.env.PU_BETA
}

function logRequest(interceptedRequest){
  console.log('A request was mode : ',interceptedRequest.url());
}
// page.on('request',logRequest);
// page.removeListener('request',logRequest);

function TestRunner(){}

TestRunner.initialize = function(){
    console.time('Initialize');

    this.url = testPlatForm[process.env.target.toUpperCase()];
    console.log(this.url);

    console.timeEnd('Initialize');
}

TestRunner.loginActions = async function (){
  let id = process.env.ID;
  let pw  = process.env.PW;

  if(id && pw){
    let consolePw = pw.split('').reduce((prev,curr,index,arr)=>{
      if(index < 5){return prev+curr;}
      else{return prev+"*"}
    },"");
    console.log(`Attempt to log in [ ID : ${id} ] `);
    console.log(`Attempt to log in [ PW : ${consolePw} ]\r\n `);

    this.browser = await puppeteer.launch(puppeteerOptions);
    this.page = await this.browser.newPage();
    await this.page.goto(this.url);

    console.log('loginCheck');
    await loginCheck(this.page);
    console.log('loginCheck after');

    await wait(2500);
    await this.puppeteerClose();  

  }else{
    throw new Error('[loginActions] Not Exist Login Configuration : Check your root directory .env')
  }
}
TestRunner.puppeteerClose = async function(){
  await this.page.close();
  await this.browser.close();
}
TestRunner.allServices = async function(){
  console.log('allServices')
}

TestRunner.otherServices = async function(service){
  console.log('otherService');
}

TestRunner.run = async function(services){
  try{
    const service = services || 'ALL';

    this.initialize();
    await this.loginActions();

    service.toUpperCase()==='ALL' ? await this.allServices() : await this.otherServices(service);
  }
  catch(err){
    console.log(err);
    process.exit(1);
  }
}
module.exports = TestRunner;