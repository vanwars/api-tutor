var activateTabs = function () {
	var $tab = $('.nav-tabs').find('li:eq(0)'),
		paneID = $tab.find('a').attr('href');
	$tab.addClass('active');
	console.log(paneID);
	$(paneID).addClass('active');
};