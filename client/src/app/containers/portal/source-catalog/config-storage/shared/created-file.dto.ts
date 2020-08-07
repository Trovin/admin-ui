export class CreatedFile {
	body: Blob;
	name: string;

	constructor(data?: CreatedFile) {
		if(data) {
			this.body = data.body;
			this.name = data.name;
		}
	}
}
