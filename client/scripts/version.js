const fs = require('fs');

const env = process.env.NODE_ENV;
const build = process.env.BUILD_NUMBER || 'local build';
const commitHash = process.env.GIT_COMMIT;


if(!env) {
	console.log('NODE_ENV doesn\'t exist');
	return;
}

const info = `
	Build number: ${build}; \n
	Commit hash: ${commitHash};
`;

fs.appendFile(`./${env}/ver.txt`, info, (err) => {
	if(err) {
		throw err;
	}

	console.log(`ver.txt file is created successfully with build number ${build}.`);
});
