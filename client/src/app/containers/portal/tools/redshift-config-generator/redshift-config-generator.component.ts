import { Component } from '@angular/core';

@Component({
	selector: 'redshift-config-generator',
	templateUrl: './redshift-config-generator.html',
	styleUrls: ['./redshift-config-generator.scss']
})

export class ToolsRedshiftConfigGeneratorComponent {
	loading = true;

	url = 'https://galaxy-redshift-config-gen-tool.s3-us-west-2.amazonaws.com/index.html';

	onload() {
		this.loading = false;
	}
}
