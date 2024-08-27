var App = function () {

     var isMainPage = false;
     var isMapPage = false;
	var isChartPage = false;
	var isTemplatePage = false;
	var isListsPage = false;
	var isEmailsPage = false;
	var isEmailsUploadPage = false;
	var isTemplateBuilderPage = false;
	var isCampaignsPage = false;
     var isIE8 = false;
	
	var handleCampaignsDisplay = function () {
		$('#campaigns-table').DataTable( {
		"iDisplayLength": 50,
		   "ajax": "reports-crud.php?action=list",
		   "order": [[ 2, "desc" ]],
		   "language": {
				"emptyTable": "There are no campaigns to display"
		   },
		   "columnDefs": [
			  {
				orderable: false,
				"targets": [ 3 ],
			  },
			  {
				className: "dt-body-right",
				"targets": [ 3 ] 
			  }
		   ],
		   "columns": [
			  { 
				"data": "",
				"width": "40%",
				"render": function(data, type, full, meta){
					return '<a class="campaign" id="'+full.c_id+'" href="statistics.php?id='+full.c_id+'" style="color:#237a91;text-decoration:none;">' + full.subject + '</a>';

				}
			  },
			  { 
				"data": "name",
			  },
			  { 
				"data": "sent",
				"width": "20%"
			  },
			  { 
				"data": "",
				"width": "15%",
				"render": function(data, type, full, meta){
					return '<a href="#" id="'+full.id+'" class="btn delete"><i class="icon-trash"></i> Delete</a>';
				}
			  }
		   ]
		 
		} );
		
		// delete campaign
		$('#campaigns-table').on('click', 'a.delete', function () {
				var id = $(this).attr('id');
				
				$('#delete-id').val(id);
			
				$('#delete-campaign-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
		});
		
		$('#delete-campaign-btn').on('click', function () {
				$('#delete-campaign-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.cid = $('#delete-id').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'reports-crud.php?action=delete',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error)
						  },
						  dataType: 'json',
						  success: function(data) {						  
							 $('#'+jData.cid).closest('tr').effect("highlight", {color: '#e74c3c'}, 2000);
							 
							 setTimeout(function(){ 
								$('#campaigns-table').DataTable().ajax.reload();
							 }, 1000);
						  },
				});
				   
		});
		
		$('#delete-campaign-modal .close-modal').on('click', function () {
				$('#delete-campaign-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		$('.ui-widget-overlay').on('click', function () {
				$('#delete-campaign-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
	}
	
	var handleEmailsUploadDisplay = function () {
		$(document).on('change', '.area_select', function (e) {
		   generateSelectedAreas();			
		});
	
	    function generateSelectedAreas()
	    {
		   var selectedValues=[];
		   
		   //enable all options, otherwise they overlap and cause probl
		   $('.area_select option').each(function () {
			  $(this).prop('disabled', false);
		   });
		   
		   $('.area_select option:selected').each(function () {
			 var select = $(this).parent(),
			 optValue = $(this).val();
			  
			 if($(this).val()!=''){
				$('.area_select').not(select).children().filter(function(e){
				    if($(this).val()==optValue)
					   return e
				}).prop('disabled', true);
			 }
		   });
	    }
	}
	
	var handleEmailsDisplay = function () {
		$('#emails-table').DataTable( {
		"iDisplayLength": 50,
		   "ajax": "emails-crud.php?action=list",
		   "dom": 'Bfrtip',
		   "buttons": [
			  'copy', 'csv'
		   ],
		   "order": [[ 3, "desc" ]],
		   "language": {
				"emptyTable": "There are no emails created for this list"
		   },
		   "columnDefs": [
			  {
				orderable: false,
				"targets": [ 4 ],
			  },
			  { 
				className: "dt-body-right",
				"targets": [ 4 ] 
			  }
		   ],
		   "columns": [
			  { 
				"data": "email",
				"width": "30%",
				"render": function(data, type, full, meta){
					return '<a href="emails-profile.php?id='+full.id+'" style="color:#237a91;text-decoration:none;">' + full.email + '</a>';
				}
			  },
			  { 
				"data": "fname",
			  },
			  { 
				"data": "lname",
			  },
			  { 
				"data": "date_added",
			  },
			  { 
				"data": "",
				"width": "21%",
				"render": function(data, type, full, meta){
					return '<a href="#" id="'+full.id+'" data-email="'+full.email+'" data-fname="'+full.fname+'" data-lname="'+full.lname+'" class="btn edit"><i class="icon-edit"></i> Edit</a>&nbsp;<a href="#" id="'+full.id+'" class="btn delete"><i class="icon-trash"></i> Delete</a>';
				}
			  }
		   ]
		 
		} );
		
		// add email
		$('#add-email').on('click', function () {
				$('#add-email-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
				$('#add-email-address').focus();
		});
		
		$('#add-email-modal-save').on('click', function () {		
				$('#add-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.email = $('#add-email-address').val();
				jData.fname = $('#add-email-fname').val();
				jData.lname = $('#add-email-lname').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'emails-crud.php?action=create',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error);
						  },
						  dataType: 'json',
						  success: function(data) {
							$('#emails-table').DataTable().ajax.reload();
							setTimeout(function(){ 
								$('#'+data.Id).closest('tr').effect("highlight", {color: '#2ecc71'}, 2000);
							 }, 500);
						  },
				});
		});
		
		$('#add-email-modal .close-modal').on('click', function () {
				$('#add-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});

		// edit email
		$('#emails-table').on('click', 'a.edit', function () {
				var id = $(this).attr('id');
				var email = $(this).attr('data-email');
				var fname = $(this).attr('data-fname');
				var lname = $(this).attr('data-lname');
				
				$('#email-id').val(id);
				$('#edit-email-address').val(email);
				$('#edit-email-fname').val(fname);
				$('#edit-email-lname').val(lname);
			
				$('#edit-email-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');	
				$('#edit-email-address').focus();
		});
		
		$('#edit-email-modal-save').on('click', function () {
				$('#edit-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.id = $('#email-id').val();
				jData.email = $('#edit-email-address').val();
				jData.fname = $('#edit-email-fname').val();
				jData.lname = $('#edit-email-lname').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'emails-crud.php?action=update',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error)
						  },
						  dataType: 'json',
						  success: function(data) {
							 $('#emails-table').DataTable().ajax.reload();
							 setTimeout(function(){
								$('#'+jData.id).closest('tr').effect("highlight", {color: '#2ecc71'}, 2000);
							 }, 500);
						  },
				   });
				   
		});
		
		$('#edit-email-modal .close-modal').on('click', function () {
				$('#edit-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		// delete email
		$('#emails-table').on('click', 'a.delete', function () {
				var id = $(this).attr('id');
				
				$('#delete-id').val(id);
			
				$('#delete-email-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
		});
		
		$('#delete-email-btn').on('click', function () {
				$('#delete-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.id = $('#delete-id').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'emails-crud.php?action=delete',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error)
						  },
						  dataType: 'json',
						  success: function(data) { 
						  
							$('#'+jData.id).closest('tr').effect("highlight", {color: '#e74c3c'}, 2000);
							 
							 setTimeout(function(){ 
								$('#emails-table').DataTable().ajax.reload();
							 }, 1000);
						  },
				});
				   
		});
		
		$('#delete-email-modal .close-modal').on('click', function () {
				$('#delete-email-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		// import contacts
		$('#import-contacts').on('click', function () {
				$('#import-contacts-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
		});
		
		$('#import-contacts-close').on('click', function () {
				$('#import-contacts-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');		
		});
		
		$('#import-contacts-modal .close-modal').on('click', function () {
				$('#import-contacts-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');		
		});
		
		// upload file
		$('#upload-file').on('click', function () {
				$('#upload-file-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
		});
		
		$('#upload-file-close').on('click', function () {
				$('#upload-file-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');		
		});
		
		$('#upload-file-modal .close-modal').on('click', function () {
				$('#upload-file-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');		
		});
		
		$('.ui-widget-overlay').on('click', function () {
				$('#add-email-modal').fadeOut('slow');
				$('#edit-email-modal').fadeOut('slow');
				$('#delete-email-modal').fadeOut('slow');
				$('#import-contacts-modal').fadeOut('slow');
				$('#upload-file-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
	}
	
	var handleListsDisplay = function () {
		$('#lists-table').DataTable( {
		   "ajax": "lists-crud.php?action=list",
		   "order": [[ 3, "desc" ]],
		   "language": {
				"emptyTable": "There are no lists created"
		   },
		   "columnDefs": [
			  {
				orderable: false,
				"targets": [ 3 ],
			  },
			  { 
				className: "dt-body-right", 
				"targets": [ 3 ] 
			  }
		   ],
		   "columns": [
			  { 
				"data": "name",
				"width": "40%",
				"render": function(data, type, full, meta){
					return '<a href="emails.php?id='+full.id+'" style="color:#237a91;text-decoration:none;">' + full.name + '</a>';
				}
			  },
			  { 
				"data": "contacts",
			  },
			  { 
				"data": "created",
			  },
			  { 
				"data": "",
				"width": "21%",
				"render": function(data, type, full, meta){
					return '<a href="#" id="'+full.id+'" data-name="'+full.name+'" class="btn edit"><i class="icon-edit"></i> Edit</a>&nbsp;<a href="#" id="'+full.id+'" class="btn delete"><i class="icon-trash"></i> Delete</a>';
				}
			  }
		   ]
		 
		} );
		
		// add list
		$('#add-list').on('click', function () { console.log('add')
				$('#add-list-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
				$('#add-list-modal input').focus();
		});
		
		$('#add-list-modal-save').on('click', function () {		
				$('#add-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.list = $('#add-list-modal input').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'lists-crud.php?action=create',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error);
						  },
						  dataType: 'json',
						  success: function(data) {
							$('#lists-table').DataTable().ajax.reload();
							setTimeout(function(){ 
								$('#'+data.Id).closest('tr').effect("highlight", {color: '#2ecc71'}, 2000);
							 }, 500);
						  },
				});
		});
		
		$('#add-list-modal .close-modal').on('click', function () {
				$('#add-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		// edit list
		$('#lists-table').on('click', 'a.edit', function () {
				var id = $(this).attr('id');
				var name = $(this).attr('data-name');
				
				$('#list-id').val(id);
				$('#list-name').val(name);
			
				$('#edit-list-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');	
				$('#list-name').focus();
		});
		
		$('#edit-list-modal-save').on('click', function () {
				$('#edit-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.listid = $('#list-id').val();
				jData.list = $('#list-name').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'lists-crud.php?action=update',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error)
						  },
						  dataType: 'json',
						  success: function(data) {
							 $('#lists-table').DataTable().ajax.reload();
							 setTimeout(function(){ 
								$('#'+jData.listid).closest('tr').effect("highlight", {color: '#2ecc71'}, 2000);
							 }, 500);
						  },
				   });
				   
		});
		
		$('#edit-list-modal .close-modal').on('click', function () {
				$('#edit-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		// delete list
		$('#lists-table').on('click', 'a.delete', function () {
				var id = $(this).attr('id');
				
				$('#delete-id').val(id);
			
				$('#delete-list-modal').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
		});
		
		$('#delete-list-btn').on('click', function () {
				$('#delete-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
				
				var jData = {};
				jData.listid = $('#delete-id').val();
				
				$.ajax({
						  type: 'POST',
						  url: 'lists-crud.php?action=delete',
						  async: true,
						  data: jData,
						  error: function(error) {
							console.log('error', error)
						  },
						  dataType: 'json',
						  success: function(data) { 
						  
							$('#'+jData.listid).closest('tr').effect("highlight", {color: '#e74c3c'}, 2000);
							 
							 setTimeout(function(){ 
								$('#lists-table').DataTable().ajax.reload();
							 }, 1000);
						  },
				});
				   
		});
		
		$('#delete-list-modal .close-modal').on('click', function () {
				$('#delete-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
		
		$('.ui-widget-overlay').on('click', function () {
				$('#add-list-modal').fadeOut('slow');
				$('#edit-list-modal').fadeOut('slow');
				$('#delete-list-modal').fadeOut('slow');
				$('.ui-widget-overlay').fadeOut('slow');
		});
	}
	
	var handleTemplateDisplay = function () {
		$("#createTemplateBtn").css("display", "inline-block");
		
		$("#step2").removeClass("sf-active");
		$("#step3").removeClass("sf-active");
		
	}
	 
	var handleTemplateBuilder = function () {
		 var uid = $('#user-id').val();
		 sessionStorage.setItem('uid', uid);
	}
	 
	 var handleCharts = function () {
	 
	 	var cid =	$('#cid').val();

		var jData = {};
		jData.cid = cid;
		
		$.ajax({
			  type: 'POST',
			  url: 'charts.php',
			  async: true,
			  data: jData,
			  error: function(error) {
				console.log('error', error.error())
			  },
			  dataType: 'json',
			  success: function(data) {
							console.log('success data ',data)
							
							var myEmails = [];
							var myLinks = [];
														
							// Create array for emails clicked per day
							for (var i = 0; i < data.timeframe.length; i++) {
								
								var dateStr = data.timeframe[i]['opened_unix'];
								
								
								
								
								console.log('dateStr ', dateStr)
								
								var d = new Date(dateStr*1000);
								
								console.log('d ',d)
								
							//	console.log('d ',d)
								
								/*
								var a = dateStr.split(" ");
								var d = a[0].split("-");
								var t = a[1].split(":");
								
								var d = new Date(d[0],(d[1]-1),d[2],t[0]);
								*/
								var year = d.getFullYear();
								var month = d.getMonth();
								var day = d.getDate();
								var hour = d.getHours();
								
								console.log('year ',year,'month ',month, 'day ',day, 'hour ',hour)
								
								myEmails.push([Date.UTC(year, month, day, hour), parseInt(data.timeframe[i]['count'])]);

							}
							console.log('myEmails ',myEmails)

							// Create array for links clicked per day
							for (var i = 0; i < data.links.length; i++) {
								
								var dateStr = data.links[i]['clicked_unix'];
								var d = new Date(dateStr*1000);
								/*var a = dateStr.split(" ");
								var d = a[0].split("-");
								var t = a[1].split(":");
								
								var d = new Date(d[0],(d[1]-1),d[2],t[0]);
								*/
								var year = d.getFullYear();
								var month = d.getMonth();
								var day = d.getDate();
								var hour = d.getHours();
								
								myLinks.push([Date.UTC(year, month, day, hour), parseInt(data.links[i]['count'])]);

							}			
			console.log('myLinks ',myLinks)
			
							$('#timeframe-container').highcharts({
								credits: {
									enabled: false
								},
								chart: {
									type: 'column',
									zoomType: 'xy'
								},
								title: {
									text: 'Timeframe'
								},
								subtitle: {
									text: 'Daily number of email opens and link clicks after campaign has been sent'
								},
								xAxis: {
									type: "datetime"
								},
								yAxis: {
									min: 0,
									title: {
										text: null
									}
								},
								plotOptions: {
									column: {
										pointPadding: 0.2,
										borderWidth: 0
									}
								},
								series: [{
									name: 'Email opens',
									data: myEmails									
								},{
									name: 'Link Clicks',
									data: myLinks
								}]
							});
							
	//				console.log('data ',data)
					
					var myBrowsers = [];
					var chrome = 0;
					var firefox = 0;
					var ie = 0;
					var safari = 0;
					var opera = 0;
					var netscape = 0;
					var maxthon = 0;
					var konqueror = 0;
					var handheld = 0;

					for (var i = 0; i < data.browsers.length; i++) {
						
							switch(data.browsers[i]['browser']){
									case 'Internet Explorer':
											ie++;
									break;
									case 'Chrome':
											chrome++;
									break;
									case 'Firefox':
											firefox++;
									break;
									case 'Safari':
											safari++;
									break;
									case 'Opera':
											opera++;
									break;
									case 'Netscape':
											netscape++;
									break;	
									case 'Maxthon':
											maxthon++;
									break;	
									case 'Konqueror':
											konqueror++;
									break;
									case 'Handheld Browser':
											handheld++;
									break;						
							}
						
						
					}
					
							if(ie > 0)
									myBrowsers.push({"name":"Internet Explorer","y":ie});
							if(chrome > 0)
									myBrowsers.push({"name":"Chrome","y":chrome});
							if(firefox > 0)
									myBrowsers.push({"name":"Firefox","y":firefox});
							if(safari > 0)
									myBrowsers.push({"name":"Safari","y":safari});
							if(opera > 0)
									myBrowsers.push({"name":"Opera","y":opera});
							if(netscape > 0)
									myBrowsers.push({"name":"Netscape","y":netscape});
							if(maxthon > 0)
									myBrowsers.push({"name":"Maxthon","y":maxthon});
							if(konqueror > 0)
									myBrowsers.push({"name":"Konqueror","y":konqueror});
							if(handheld > 0)
									myBrowsers.push({"name":"Handheld Browser","y":handheld});
									



						var name = Array();
						var data1 = Array();
						var dataArrayFinal = Array();
						for( i = 0; i < myBrowsers.length; i++ ) { 
						   name[i] = myBrowsers[i].name; 
						   data1[i] = myBrowsers[i].y;  
						}
						
						for( j = 0; j < name.length; j++ ) { 
						   var temp = new Array( name[j], data1[j] ); 
						   dataArrayFinal[j] = temp;
						}

				
						$('#browsers-container').highcharts({
							credits: {
								enabled: false
							},
							chart: {
								type: 'pie'
							},
							title: {
								text: 'Browsers'
							},
							subtitle: {
								text: 'Pie chart of end user browser'
							},
							plotOptions: {
								
								pie: {
									size: 250,
									dataLabels: {
										enabled: false
									},
									showInLegend: true
								}
							},
							tooltip: {
                					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							series: [{
								  name: 'Browser share',
								  data: dataArrayFinal
							}]
					});
					
					
					
					
					
					
					
					var myCountries = [];  
										 
		for( var c = 0; c < data.countries.length; c++ ){
										
				data.countries[c]['country'] == '' ? myCountries.push({"name":"Unknown","y":parseInt(data.countries[c]['count'])}) : myCountries.push({"name":data.countries[c]['country'],"y":parseInt(data.countries[c]['count'])});		
						
	
		}
		
		
	//	console.log('countries ',myCountries)
		
var name = Array();
var data1 = Array();
var dataArrayFinal = Array();
for( i = 0; i < myCountries.length; i++ ) { 
   name[i] = myCountries[i].name; 
   data1[i] = myCountries[i].y;  
}

for( j = 0; j < name.length; j++ ) { 
   var temp = new Array( name[j], data1[j] );
   dataArrayFinal[j] = temp;
}		

//console.log(dataArrayFinal)
	
			$('#countries-container').highcharts({
							credits: {
								enabled: false
							},
							chart: {
								type: 'pie'
							},
							title: {
								text: 'Countries'
							},
							subtitle: {
								text: 'Pie chart of end user location'
							},
							plotOptions: {
								
								pie: {
									size: 250,
									dataLabels: {
										enabled: false
									},
									showInLegend: true
								}
							},
							tooltip: {
                					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							series: [{
								  name: 'Location percent',
								  data: dataArrayFinal
							}]
					});
					
			  },
		});
		
		// Datatables
		$.ajax({
				  type: 'POST',
				  url: 'statistics-crud.php?action=uniqueopens',
				  async: true,
				  data: jData,
				  error: function(error) {
					console.log('error', error)
				  },
				  dataType: 'json',
				  success: function(data) {
					  	// Unique Opens				 
						$('#unique-opens-table').DataTable( {
							"iDisplayLength": 50,
							   "order": [[ 1, "desc" ]],
							   "language": {
									"emptyTable": "There are no emails to display"
							   },
							   "data": data.uniqueopens,
							   "columns": [
								  { 
									"data": "",
									"width": "40%",
									"render": function(data, type, full, meta){
										return '<a class="campaign" href="#" style="color:#237a91;text-decoration:none;">' + full.email + '</a>';
									}
								  },
								  { 
									"data": "opened",
								  }
							   ]
						});
						// Unsubscribes				 
						$('#unsubscribes-table').DataTable( {
							"iDisplayLength": 50,
							   "order": [[ 1, "desc" ]],
							   "language": {
									"emptyTable": "There are no emails to display"
							   },
							   "data": data.unsubscribes,
							   "columns": [
								  { 
									"data": "",
									"width": "40%",
									"render": function(data, type, full, meta){
										return '<a class="campaign" href="#" style="color:#237a91;text-decoration:none;">' + full.email + '</a>';
									}
								  },
								  { 
									"data": "unsubscribed_date",
								  }
							   ]
						});
						// Bounces				 
						$('#bounces-table').DataTable( {
							"iDisplayLength": 50,
							   "order": [[ 1, "desc" ]],
							   "language": {
									"emptyTable": "There are no emails to display"
							   },
							   "data": data.bounces,
							   "columns": [
								  { 
									"data": "",
									"width": "90%",
									"render": function(data, type, full, meta){
										return '<a class="campaign" href="#" style="color:#237a91;text-decoration:none;">' + full.email + '</a>';
									}
								  },
								  {
									"data": "error_code"
								  },
								  { 
									"data": "bounced_date"
								  }
							   ]
						});
						
				  },
		});
		// Link Clicks		
		$('#link-clicks-table').DataTable( {
			"iDisplayLength": 50,
			   "ajax": "statistics-crud.php?action=linkclicks&cid="+cid,
			   "order": [[ 1, "desc" ]],
			   "language": {
					"emptyTable": "There are no links to display"
			   },
			   "columns": [
				  { 
					"data": "",
					"width": "90%",
					"render": function(data, type, full, meta){
						return '<a class="campaign" href="'+full.link+'" target="_blank" style="color:#237a91;text-decoration:none;">' + full.link + '</a>';
					}
				  },
				  { 
					"data": "count",
				  }
			   ]
		});
	 }
	
	var handleTemplate = function () {
		$('a.template-btn').click(function() {
			var id = $(this).attr('id');
			sessionStorage.setItem('tid', id);
		});
	}

    var handleClockfaceTimePickers = function () {

        if (!jQuery().clockface) {
            return;
        }

        $('#clockface_1').clockface();

        $('#clockface_2').clockface({
            format: 'HH:mm',
            trigger: 'manual'
        });

        $('#clockface_2_toggle-btn').click(function (e) {
            e.stopPropagation();
            $('#clockface_2').clockface('toggle');
        });

        $('#clockface_3').clockface({
            format: 'H:mm'
        }).clockface('show', '14:30');
    }

    var handlePortletSortable = function () {
        if (!jQuery().sortable) {
            return;
        }
        $(".sortable").sortable({
            connectWith: '.sortable',
            iframeFix: false,
            items: 'div.widget',
            opacity: 0.8,
            helper: 'original',
            revert: true,
            forceHelperSize: true,
            placeholder: 'sortable-box-placeholder round-all',
            forcePlaceholderSize: true,
            tolerance: 'pointer'
        });

    }

    var handleMainMenu = function () {
        jQuery('#sidebar .has-sub > a').click(function () {
            var last = jQuery('.has-sub.open', $('#sidebar'));
            last.removeClass("open");
            jQuery('.arrow', last).removeClass("open");
            jQuery('.sub', last).slideUp(200);
            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("open");
                sub.slideUp(200);
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(200);
            }
        });
    }

    var handleWidgetTools = function () {
        jQuery('.widget .tools .icon-remove').click(function () {
            jQuery(this).parents(".widget").parent().remove();
        });

        jQuery('.widget .tools .icon-refresh').click(function () {
            var el = jQuery(this).parents(".widget");
            App.blockUI(el);
            window.setTimeout(function () {
                App.unblockUI(el);
            }, 1000);
        });

        jQuery('.widget .tools .icon-chevron-down, .widget .tools .icon-chevron-up').click(function () {
            var el = jQuery(this).parents(".widget").children(".widget-body");
            if (jQuery(this).hasClass("icon-chevron-down")) {
                jQuery(this).removeClass("icon-chevron-down").addClass("icon-chevron-up");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("icon-chevron-up").addClass("icon-chevron-down");
                el.slideDown(200);
            }
        });
    }

    var handleFancyBox = function () {
        if (!jQuery().fancybox) {
            return;
        }

        if (jQuery(".fancybox-button").size() > 0) {
            jQuery(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    }

    var handleLoginForm = function () {
	   $('#input-username').focus();
        jQuery('#forget-password').click(function () {
            jQuery('#loginform').hide();
            jQuery('#forgotform').show(200);
        });

        jQuery('#forget-btn').click(function () {

            var email = $('#input-email').val();
		   
		   $.ajax({
				  type: 'POST',
				  url: 'forgot-pass.php',
				  async: true,
				  data: {
					 email: email
				  },
				  error: function(error) {
					console.log('error', error.error())
				  },
				  success: function(data) { console.log(data)
					if(data == 'success'){ 
						jQuery('#loginform').slideDown(200);
            				jQuery('#forgotform').slideUp(200);
						$("#message-box").html("The reset password link has been emailed");
					} else {
						$("#forgot-pass-text").html("The email entered does not exist in the system");
					}
				  },
		    });
            
        });
    }

    var handleStyler = function () {
        var scrollHeight = '25px';

        jQuery('#theme-change').click(function () {
            if ($(this).attr("opened") && !$(this).attr("opening") && !$(this).attr("closing")) {
                $(this).removeAttr("opened");
                $(this).attr("closing", "1");

                $("#theme-change").css("overflow", "hidden").animate({
                    width: '20px',
                    height: '22px',
                    'padding-top': '3px'
                }, {
                    complete: function () {
                        $(this).removeAttr("closing");
                        $("#theme-change .settings").hide();
                    }
                });
            } else if (!$(this).attr("closing") && !$(this).attr("opening")) {
                $(this).attr("opening", "1");
                $("#theme-change").css("overflow", "visible").animate({
                    width: '190px',
                    height: scrollHeight,
                    'padding-top': '3px'
                }, {
                    complete: function () {
                        $(this).removeAttr("opening");
                        $(this).attr("opened", 1);
                    }
                });
                $("#theme-change .settings").show();
            }
        });

        jQuery('#theme-change .colors span').click(function () {
            var color = $(this).attr("data-style");
            setColor(color);
        });

        jQuery('#theme-change .layout input').change(function () {
            setLayout();
        });

        var setColor = function (color) {
            $('#style_color').attr("href", "css/style_" + color + ".css");
        }

    }

    var handleDeviceWidth = function () {
        function fixWidth(e) {
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            //alert(winWidth);
            //for tablet and small desktops
            if (winWidth < 1125 && winWidth > 767) {
                $(".responsive").each(function () {
                    var forTablet = $(this).attr('data-tablet');
                    var forDesktop = $(this).attr('data-desktop');
                    if (forTablet) {
                        $(this).removeClass(forDesktop);
                        $(this).addClass(forTablet);
                    }

                });
            } else {
                $(".responsive").each(function () {
                    var forTablet = $(this).attr('data-tablet');
                    var forDesktop = $(this).attr('data-desktop');
                    if (forTablet) {
                        $(this).removeClass(forTablet);
                        $(this).addClass(forDesktop);
                    }
                });
            }
        }

        fixWidth();

        running = false;
        jQuery(window).resize(function () {
            if (running == false) {
                running = true;
                setTimeout(function () {
                    // fix layout width
                    fixWidth();
                    // fix calendar width by just reinitializing
                  //  ();
                    if (isMainPage) {
                    //    (); // handles full calendar for main page
                    } else {
                     //   handleCalendar(); // handles full calendars
                    }
                    // fix vector maps width
                    if (isMainPage) {
                        jQuery('.vmaps').each(function () {
                            var map = jQuery(this);
                            map.width(map.parent().parent().width());
                        });
                    }
                    if (isMapPage) {
                        jQuery('.vmaps').each(function () {
                            var map = jQuery(this);
                            map.width(map.parent().width());
                        });
                    }
                    // fix event form chosen dropdowns
                    $('#event_priority_chzn').width($('#event_title').width() + 15);
                    $('#event_priority_chzn .chzn-drop').width($('#event_title').width() + 13);

                    $(".chzn-select").val('').trigger("liszt:updated");
                    //finish
                    running = false;
                }, 200); // wait for 200ms on resize event           
            }
        });
    }

    var handleGritterNotifications = function () {
        if (!jQuery.gritter) {
            return;
        }
        $('#gritter-sticky').click(function () {
            var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a sticky notice!',
                // (string | mandatory) the text inside the notification
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#" style="color:#ccc">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: true,
                // (int | optional) the time you want it to be alive for before fading out
                time: '',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'my-sticky-class'
            });
            return false;
        });

        $('#gritter-regular').click(function () {

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a regular notice!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#" style="color:#ccc">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: false,
                // (int | optional) the time you want it to be alive for before fading out
                time: ''
            });

            return false;

        });

        $('#gritter-max').click(function () {

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a notice with a max of 3 on screen at one time!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#" style="color:#ccc">magnis dis parturient</a> montes, nascetur ridiculus mus.',
                // (string | optional) the image to display on the left
                image: 'img/avatar-mini.png',
                // (bool | optional) if you want it to fade out on its own or just sit there
                sticky: false,
                // (function) before the gritter notice is opened
                before_open: function () {
                    if ($('.gritter-item-wrapper').length == 3) {
                        // Returning false prevents a new gritter from opening
                        return false;
                    }
                }
            });
            return false;
        });

        $('#gritter-without-image').click(function () {
            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a notice without an image!',
                // (string | mandatory) the text inside the notification
                text: 'This will fade out after a certain amount of time. Vivamus eget tincidunt velit. Cum sociis natoque penatibus et <a href="#" style="color:#ccc">magnis dis parturient</a> montes, nascetur ridiculus mus.'
            });

            return false;
        });

        $('#gritter-light').click(function () {

            $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'This is a light notification',
                // (string | mandatory) the text inside the notification
                text: 'Just add a "gritter-light" class_name to your $.gritter.add or globally to $.gritter.options.class_name',
                class_name: 'gritter-light'
            });

            return false;
        });

        $("#gritter-remove-all").click(function () {

            $.gritter.removeAll();
            return false;

        });
    }

    var handleTooltip = function () {
        jQuery('.tooltips').tooltip();
    }

    var handlePopover = function () {
        jQuery('.popovers').popover();
    }

    var handleChoosenSelect = function () {
        if (!jQuery().chosen) {
            return;
        }
        $(".chosen").chosen();
        $(".chosen-with-diselect").chosen({
            allow_single_deselect: true
        });
    }

    var handleUniform = function () {
        if (!jQuery().uniform) {
            return;
        }
        if (test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle)")) {
            test.uniform();
        }
    }

    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }

        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5();
        }
    }

    var handleToggleButtons = function () {
        if (!jQuery().toggleButtons) {
            return;
        }
        $('.basic-toggle-button').toggleButtons();
        $('.text-toggle-button').toggleButtons({
            width: 200,
            label: {
                enabled: "Lorem Ipsum",
                disabled: "Dolor Sit"
            }
        });
        $('.danger-toggle-button').toggleButtons({
            style: {
                // Accepted values ["primary", "danger", "info", "success", "warning"] or nothing
                enabled: "danger",
                disabled: "info"
            }
        });
        $('.info-toggle-button').toggleButtons({
            style: {
                enabled: "info",
                disabled: ""
            }
        });
        $('.success-toggle-button').toggleButtons({
            style: {
                enabled: "success",
                disabled: "danger"
            }
        });
        $('.warning-toggle-button').toggleButtons({
            style: {
                enabled: "warning",
                disabled: "success"
            }
        });

        $('.height-toggle-button').toggleButtons({
            height: 100,
            font: {
                'line-height': '100px',
                'font-size': '20px',
                'font-style': 'italic'
            }
        });

        $('.not-animated-toggle-button').toggleButtons({
            animated: false
        });

        $('.transition-value-toggle-button').toggleButtons({
            transitionspeed: 1 // default value: 0.05
        });

    }

    var handleTables = function () {
        if (!jQuery().dataTable) {
            return;
        }

        // begin first table
        $('#sample_1').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }]
        });

        jQuery('#sample_1 .group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            jQuery.uniform.update(set);
        });

        jQuery('#sample_1_wrapper .dataTables_filter input').addClass("input-medium"); // modify table search input
        jQuery('#sample_1_wrapper .dataTables_length select').addClass("input-mini"); // modify table per page dropdown

        // begin second table
        $('#sample_2').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }]
        });

        jQuery('#sample_2 .group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            jQuery.uniform.update(set);
        });

        jQuery('#sample_2_wrapper .dataTables_filter input').addClass("input-small"); // modify table search input
        jQuery('#sample_2_wrapper .dataTables_length select').addClass("input-mini"); // modify table per page dropdown

        // begin: third table
        $('#sample_3').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }]
        });

        jQuery('#sample_3 .group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            jQuery.uniform.update(set);
        });

        jQuery('#sample_3_wrapper .dataTables_filter input').addClass("input-small"); // modify table search input
        jQuery('#sample_3_wrapper .dataTables_length select').addClass("input-mini"); // modify table per page dropdown
    }

    var handleDateTimePickers = function () {

        if (!jQuery().daterangepicker) {
            return;
        }

        $('.date-range').daterangepicker();

        $('#dashboard-report-range').daterangepicker({
            ranges: {
                'Today': ['today', 'today'],
                'Yesterday': ['yesterday', 'yesterday'],
                'Last 7 Days': [Date.today().add({
                    days: -6
                }), 'today'],
                'Last 30 Days': [Date.today().add({
                    days: -29
                }), 'today'],
                'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                    months: -1
                }), Date.today().moveToFirstDayOfMonth().add({
                    days: -1
                })]
            },
            opens: 'left',
            format: 'MM/dd/yyyy',
            separator: ' to ',
            startDate: Date.today().add({
                days: -29
            }),
            endDate: Date.today(),
            minDate: '01/01/2012',
            maxDate: '12/31/2014',
            locale: {
                applyLabel: 'Submit',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger']
        },

        function (start, end) {
            App.blockUI(jQuery("#page"));
            setTimeout(function () {
                App.unblockUI(jQuery("#page"));
                $.gritter.add({
                    title: 'Dashboard',
                    text: 'Dashboard date range updated.'
                });
                App.scrollTo();
            }, 1000);
            $('#dashboard-report-range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));

        });

        $('#dashboard-report-range span').html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));

        $('#form-date-range').daterangepicker({
            ranges: {
                'Today': ['today', 'today'],
                'Yesterday': ['yesterday', 'yesterday'],
                'Last 7 Days': [Date.today().add({
                    days: -6
                }), 'today'],
                'Last 30 Days': [Date.today().add({
                    days: -29
                }), 'today'],
                'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                    months: -1
                }), Date.today().moveToFirstDayOfMonth().add({
                    days: -1
                })]
            },
            opens: 'right',
            format: 'MM/dd/yyyy',
            separator: ' to ',
            startDate: Date.today().add({
                days: -29
            }),
            endDate: Date.today(),
            minDate: '01/01/2012',
            maxDate: '12/31/2014',
            locale: {
                applyLabel: 'Submit',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger']
        },

        function (start, end) {
            $('#form-date-range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
        });

        $('#form-date-range span').html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));


        if (!jQuery().datepicker || !jQuery().timepicker) {
            return;
        }
        $('.date-picker').datepicker();

        $('.timepicker-default').timepicker();

        $('.timepicker-24').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false
        });

    }

    var handleScrollers = function () {
        if (!jQuery().slimScroll) {
            return;
        }

        $('.scroller').each(function () {
            $(this).slimScroll({
                //start: $('.blah:eq(1)'),
                height: $(this).attr("data-height"),
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: true
            });
        });
    }
	
    var first = 0;
    var handleFormWizards = function () {
        if (!jQuery().bootstrapWizard) {
            return;
        }

        $('#form_wizard_1').bootstrapWizard({
            'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab, navigation, index) {
                return false;
            },
            onNext: function (tab, navigation, index) {
				
                var total = navigation.find('li').length;
                var current = index + 1;
				
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
				
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
				
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
				
					
                    $('#form_wizard_1').find('.button-previous').hide();
                } else {
					
					if (current == 2){ 
					
					var tid = sessionStorage.getItem('tid');
										
					console.log('tid ',tid)
					
					if(first == 0){ console.log('first')
							first = 1;
							$("#createTemplateBtn").css("display", "none");
							$("#step2").addClass("sf-active");

							$.ajax({
								  type: 'POST',
								  url: 'template.php',
								  async: true,
								  data: {
									 id: tid
								  },
								  error: function(error) {
									console.log('error', error.error())
								  },
								  dataType: 'json',
								  success: function(data) {
										$('#edittemplate').html(data);
										$('#edittemplate').fadeIn('slow');
										$('#form_wizard_1').find('#prev-btn').fadeIn('slow');
										$('#form_wizard_1').find('.next-btn').fadeIn('slow');
								  },
							});
						   
							$.getScript( "assets/ck-editor/ckeditor.js", function( data, textStatus, jqxhr ) {
							
									  console.log( textStatus ); // Success
								
							});
							
					}
						   
					} else { 
							var tid = sessionStorage.getItem('tid');
										
							console.log('tid ',tid)
							console.log('Complete Form')
							
							$("#createTemplateBtn").css("display", "none");
							$('#form_wizard_1').find('.button-previous').show();
							$("#step3").addClass("sf-active");
							
							var jData = {};
							jData.tid = tid;
							jData.html = $('#edittemplate').html();
							
							$.ajax({
								  type: 'POST',
								  url: 'savetemplate.php',
								  async: true,
								  data: jData,
								  error: function(error) {
									console.log('error', error)
								  },
								  success: function(data) { 
								  
										console.log('saved template success')
									 
								  },
						   });
						   
						   $('#form_wizard_1').find('#continuebtn').hide();
						   $('#form_wizard_1').find('.button-submit').show();
					
					}
					
                }
                App.scrollTo($('.page-title'));
            },
            onPrevious: function (tab, navigation, index) {
				
			console.log('hit back')
			$("#step3").removeClass("sf-active");
			// Destroy the editor.
			//		editor.destroy();
			//		editor = null;
			//		  $('#edittemplate').html('');

				
                var total = navigation.find('li').length;
                var current = index + 1;
				
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
				
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
					console.log('current 1111111111 ', current)
		//			$('#form_wizard_1').find('#continuebtn').hide();
        //            $('#form_wizard_1').find('.button-previous').hide();
                } else {
					console.log('current 222222222 ',current)
					
					
					$('#form_wizard_1').find('.button-submit').hide();
                    $('#form_wizard_1').find('.button-previous').hide();
					$('#form_wizard_1').find('#continuebtn').show();
                }


/*
                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                } else {
                //    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
				*/

                App.scrollTo($('.page-title'));
            },
            onTabShow: function (tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                var $percent = (current / total) * 100;
                $('#form_wizard_1').find('.bar').css({
                    width: $percent + '%'
                });
				
            }
        });
        $('#form_wizard_1').find('.button-previous').hide();
        $('#form_wizard_1 .button-submit').click(function () {
		   var tid = sessionStorage.getItem('tid');
		   
		   var error = false;
		   var jData = {};
		   jData.tid = tid;
		   jData.listId = $('#lists').val();
		   jData.subject = $('#subject').val();
		   jData.fromName = $('#from-name').val();
		   jData.fromEmail = $('#from-email').val();
		   jData.replyTo = $('#replyto').val();
		   jData.gaLinkTracking = $('#gaLinkTracking').is(':checked') ? 'Yes' : 'No';
		   
		   if(jData.listId === ""){
				error = true;
		   }
		   if(jData.subject === ""){
			     $("#subjectField").addClass("error");
				error = true;   
		   }
		   if(jData.fromName === ""){
			     $("#fromName").addClass("error");
				error = true;   
		   }
		   if(jData.fromEmail === ""){
			     $("#fromEmail").addClass("error");
				error = true;   
		   }
		   if(jData.replyTo === ""){
			     $("#replyEmail").addClass("error");
				error = true;   
		   }
				
		   if(error === false){
			  
				var progressTimer, progressLabel = $( ".progress-label" ), progressbar = $( "#progressbar" );
				
				$('#dialog').fadeIn('fast');
				$('.ui-widget-overlay').fadeIn('fast');
				
				function openmodal() { 
						
						progressTimer = setTimeout( progress, 2000 );
				  
				}			
			
				var emailprogressbar = $('div#email-bar');
				
				function progress() {
				
						var val = parseInt(emailprogressbar.css('width')) || 0;
				 
				 
					    if ( val <= 99 ) { 
								progressTimer = setTimeout( progress, 50 );
						
								var width = val + Math.floor( Math.random() * 3 );
					
								progressLabel.html("Current Progress: " + width + "%");
						
					  }
					  
					  if ( val >= 100 ){
						  progressLabel.html( "Complete!" );
						  emailprogressbar.width('100%');
						  callback();
					  }
					  
					  emailprogressbar.width(width+'%');
				}
	
				$('#email-bar-close').click(function () {	
					window.location = 'reports.php?sent=true';
				})
		
				function callback(){
						console.log('FINISHED')
				}
				
				$.ajax({
					  type: 'POST',
					  url: 'send.php',
					  async: true,
					  data: jData,
					  beforeSend: function() {
						openmodal();
					  },
					  error: function(error) {
						console.log('error', error)
					  },
					  dataType: 'json',
					  success: function(data) { 
					  
						console.log('success data ',data)
						 
					  },
			   });
			   
		   }				   
			
        }).hide();
    }

    var handleTagsInput = function () {
        if (!jQuery().tagsInput) {
            return;
        }
        $('#tags_1').tagsInput({
            width: 'auto'
        });
        $('#tags_2').tagsInput({
            width: 240
        });
    }

    var handleGoTop = function () {
        /* set variables locally for increased performance */
        jQuery('#footer .go-top').click(function () {
            App.scrollTo();
        });

    }

    // this is optional to use if you want animated show/hide. But plot charts can make the animation slow.
    var handleSidebarTogglerAnimated = function () {

        $('.sidebar-toggler').click(function () {
            if ($('#sidebar > ul').is(":visible") === true) {
                $('#main-content').animate({
                    'margin-left': '25px'
                });

                $('#sidebar').animate({
                    'margin-left': '-190px'
                }, {
                    complete: function () {
                        $('#sidebar > ul').hide();
                        $("#container").addClass("sidebar-closed");
                    }
                });
            } else {
                $('#main-content').animate({
                    'margin-left': '215px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').animate({
                    'margin-left': '0'
                }, {
                    complete: function () {
                        $("#container").removeClass("sidebar-closed");
                    }
                });
            }
        })
    }

    // by default used simple show/hide without animation due to the issue with handleSidebarTogglerAnimated.
    var handleSidebarToggler = function () {

        $('.sidebar-toggler').click(function () {
            if ($('#sidebar > ul').is(":visible") === true) {
                $('#main-content').css({
                    'margin-left': '25px'
                });
                $('#sidebar').css({
                    'margin-left': '-190px'
                });
                $('#sidebar > ul').hide();
                $("#container").addClass("sidebar-closed");
            } else {
               $('#main-content').css({
                    'margin-left': '215px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }
        })
    }

    return {

        //main function to initiate template pages
        init: function () {

            handleDeviceWidth(); // handles proper responsive features of the page
            handleChoosenSelect(); // handles bootstrap chosen dropdowns

            if (isMainPage) {
              
            } else {
                handlePortletSortable(); // handles portlet draggable sorting
            }

		  if (isChartPage) {
			 handleCharts(); // handles statistics page
		  }
		  
		  if (isTemplatePage) {
			 handleTemplateDisplay(); // handles main template page
		  }
		  
		  if (isListsPage) {
			 handleListsDisplay(); // handles lists page
		  }
		  
		  if (isCampaignsPage) {
			 handleCampaignsDisplay(); // handles lists page
		  }
		  
		  if (isEmailsPage) {
			 handleEmailsDisplay(); // handles emails page
		  }
		  
		  if (isEmailsUploadPage) {
			 handleEmailsUploadDisplay(); // handles emails page
		  }
		
		  if (isTemplateBuilderPage) {
			 handleTemplateBuilder(); // handles statistics page
		  }	

		  handleTemplate(); // handles template ID in template wizard
            handleScrollers(); // handles slim scrolling contents
            handleUniform(); // handles uniform elements
            handleClockfaceTimePickers(); //handles form clockface timepickers
            handleTagsInput() // handles tag input elements
            handleTables(); // handles data tables
            handleWidgetTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleGritterNotifications(); // handles gritter notifications
            handleTooltip(); // handles bootstrap tooltips
            handlePopover(); // handles bootstrap popovers
            handleToggleButtons(); // handles form toogle buttons
            handleWysihtml5(); //handles WYSIWYG Editor 
            handleDateTimePickers(); //handles form timepickers
            handleFancyBox(); // handles fancy box image previews
            handleStyler(); // handles style customer tool
            handleMainMenu(); // handles main menu
            handleGoTop(); //handles scroll to top functionality in the footer
            handleFormWizards();
            handleSidebarToggler();

        },

        // login page setup
        initLogin: function () {
            handleLoginForm();
        },

        // wrapper function for page element pulsate
        pulsate: function (el, options) {
            var opt = jQuery.extend(options, {
                color: '#d12610', // set the color of the pulse
                reach: 15, // how far the pulse goes in px
                speed: 300, // how long one pulse takes in ms
                pause: 0, // how long the pause between pulses is in ms
                glow: false, // if the glow should be shown too
                repeat: 1, // will repeat forever if true, if given a number will repeat for that many times
                onHover: false // if true only pulsate if user hovers over the element
            });

            jQuery(el).pulsate(opt);
        },

        // wrapper function to scroll to an element
        scrollTo: function (el) {
            pos = el ? el.offset().top : 0;
            jQuery('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        // wrapper function to  block element(indicate loading)
        blockUI: function (el, loaderOnTop) {
            lastBlockedUI = el;
            jQuery(el).block({
                message: '<img src="img/loading.gif" align="absmiddle">',
                css: {
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait'
                }
            });
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock({
                onUnblock: function () {
                    jQuery(el).removeAttr("style");
                }
            });
        },

        // set main page
        setMainPage: function (flag) {
            isMainPage = flag;
        },
		
		// set chart page
        setChartPage: function (flag) {
            isChartPage = flag;
        },
	   
	   // set template page
        setTemplatePage: function (flag) {
            isTemplatePage = flag;
        },
	   
	   // set lists page
        setListsPage: function (flag) {
            isListsPage = flag;
        },
	   
	   // set campaigns page
        setCampaignsPage: function (flag) {
            isCampaignsPage = flag;
        },
	   
	   // set emails page
        setEmailsPage: function (flag) {
            isEmailsPage = flag;
        },
	   
	   // set emails upload page
        setEmailsUploadPage: function (flag) {
            isEmailsUploadPage = flag;
        },
		
		// set template builder page
        setTemplateBuilderPage: function (flag) {
            isTemplateBuilderPage = flag;
        }

    };

    //input mask

    $('.inputmask').inputmask();

}();