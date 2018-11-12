const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const worker = require('./worker');

function master(url, timelimit = 30, maxSockets = 200, callback) {
	const overallResult = {};
	let finishNum = 0;
	function finish(result) {
		for (let key in result) {
			if (!overallResult[key]) {
				overallResult[key] = result[key];
			} else {
				overallResult[key] += result[key];
			}
			finishNum++;
			if (finishNum >= numCPUs) {
				let RequestsPerSecond = 0;
				if (overallResult['200'] > 0) {
					RequestsPerSecond = overallResult['200'] / timelimit;
				}
				const data = {
					RequestsPerSecond,
					Result: overallResult
				};
				callback(data);
			}
		}
	}
	if (cluster.isMaster) {
		console.log(`Master ${process.pid} is running`);
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		cluster.on('message', (worker, result) => {
			worker.destroy();
			finish(result);
		});
	} else {
		console.log(`Worker ${process.pid} started`);
		worker(url, timelimit, parseInt(maxSockets / numCPUs), (result) => {
			process.send(result);
		});
	}
}
module.exports = master;
