const master = require('./master');
const url = 'http://120.25.154.88:9000/admin/user/me';
const timelimit = 10;
const maxSockets = 100;
master(url, timelimit, maxSockets, (result) => {
	console.log(result);
});
