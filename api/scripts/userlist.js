$.ajax({
				 method: 'GET',
				 url   : 'http://172.28.32.250:3000/user/list'
			 })
 .done((result) => {
	 // console.log(result);
	 const $target = $('#target');
	 const root    = result.data[0];
	 const html    = `<ul>
										<li>${root.userEmail}</li>
										<li>${root.userPwd}</li>
										<li>${root.userName}</li>
									</ul>`;
	 $target.append(`<p>STATUS</p><p style="color:blue">${result.status}</p>`);
	 $target.append(`<p>JSON</p><code>${JSON.stringify(result, undefined, '')}</code>`);
	 $target.append(`<p>HTML</p>${html}`);
 })
 .fail((error) => {
	 console.log('error');
 });
