var cluster = require("cluster");
var os = require("os");

const CPUS = os.cpus();
if(cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);
	CPUS.forEach((e, i) => {
		console.log(`Forking process number ${i}...`);
		cluster.fork()
	});
	cluster.on("listening", (worker) => {
		console.log("Worker %d connected", worker.process.pid);
	});
	cluster.on("disconnect", (worker) => {
		console.log("Worker %d disconnected", worker.process.pid);
	});
	cluster.on("exit", (worker, code, signal) => {
		if(signal) {
			console.log(`Worker was killed by signal: ${signal}`, worker.process.pid);
		} else if(code !== 0) {
			console.log(`Worker exited with error code: ${code}`, worker.process.pid);
		} else {
			console.log('Worker success', worker.process.pid);
		}
		
		cluster.fork(); // Ensuring a new cluster will start if an old one dies
	});
} else {
	require(`./../${process.env.NODE_ENV}/server.js`);
}