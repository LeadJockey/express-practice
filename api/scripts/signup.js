$.ajax({
				 method: 'GET',
				 url   : 'http://172.28.32.250:3000/user/next'
			 })
 .done((result) => {
	 // console.log(result);
	 const $target = $('#target');
	 const pattern = /(?<=\<[bB][oO][dD][yY]\>).*(?=\<\/[bB][oO][dD][yY]\>)/;
	 const html = pattern.exec(result);
	 if(html.length > 0){
		 // console.log('body result',html[0]);
		 $target.append(`<p>STATUS</p><p style="color:blue">200</p>`);
		 $target.append(`<p>DATA</p><textarea style="width:300px;height:60px">${html.toString()}</textarea>`);
		 $target.append(html[0]);
	 }
 })
 .fail((error) => {
	 console.log('error');
 });
