const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const awscredentials = require('../config/aws-credentials.json');
const moment = require('moment');
// AWS.config.loadFromPath('./config/aws-credentials.json'); //da pra configurar dessa forma tbm se for com uma única conta


router.get('/', async function (req, res) {

  //substituir o moment
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  var params = {
    TimePeriod: {
      End: endOfMonth,
      Start: startOfMonth
    },
    Metrics: [
      'AmortizedCost',
      'BlendedCost', //custo até o dia vigente "blended"
      'NetAmortizedCost',
      'NetUnblendedCost',
      'NormalizedUsageAmount',
      'UnblendedCost', //custo até o dia vigente unblended
      'UsageQuantity',
    ],
    Granularity: 'MONTHLY'
  }

  let response = [];

  await Promise.all(
    awscredentials.accounts.map(async (item, index) => {
      let costexplorer = new AWS.CostExplorer(item);
      let accountcost = await costexplorer.getCostAndUsage(params).promise();

      response.push({
        name: item.name,
        blendedCost: accountcost.ResultsByTime[0].Total.BlendedCost,
        UnblendedCost: accountcost.ResultsByTime[0].Total.UnblendedCost,
      })

    })
  );

  res.json({ response });


});

module.exports = router;