/*
	人物关系图谱JS v1
	------------------------------------
	zwl <530675800@qq.com>
	2016/6/23

 * description: 
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:  
 *                   写字楼里写字间，写字间里程序员；  
 *                   程序人员写程序，又拿程序换酒钱。  
 *                   酒醒只在网上坐，酒醉还来网下眠；  
 *                   酒醉酒醒日复日，网上网下年复年。  
 *                   但愿老死电脑间，不愿鞠躬老板前；  
 *                   奔驰宝马贵者趣，公交自行程序员。  
 *                   别人笑我忒疯癫，我笑自己命太贱；  
 *                   不见满街漂亮妹，哪个归得程序员？
 */

$(function() {

	// 首次加载用户
	getAjaxObj(
		'data/data.json', 
		function(obj) {
			$('.map-main').html(generateHTMLMAP(obj));
			setMap();
		}, function() {
			console.log(err)
		}
	);


	// 隐藏信息弹层
	$('.usr-info-mod h3 b').click(function() {
		hideInfoLayer ();
	})


	// 移动人关系图
	var isHolder = false;
	var moveObj = {
		x: 0,
		y: 0,
		top: 0,
		left: 0
	}


	$('.map-main')
	.on('click','.next-btn, .back-btn, .see-this-info', function() {

		var _ = $(this);
		var _class = _.attr('class');

		console.log(_class);

		// 更多功能
		if ( /next-btn/.test(_class) ) {

			$(this).parents('ul').addClass('hide-list')
			.next().addClass('fade-list');

		} 

		// 返回功能 
		else if (/back-btn/.test(_class) ) {
			_.parents('ul').addClass('hide-list')
			.prev().removeClass('hide-list').addClass('fade-list');

			setTimeout(function() {
				_.parents('ul').removeClass()
			}, 400)
			
		}

		// 查看详情
		else if (/see-this-info/.test(_class) ) {

			var _ = $(this);
			var name = _.prev().text();

			console.log(name);

			$('.usr-info-mod').show().addClass('slideUp-fadeIn')

		}

	})
	.on('click','.relate-box .usr-head-ico', function() {
		
		// 切换人物
		var _ = $(this);
		var box = $('.usr-main-box');
		var people = _.find('p').text();
		var imgSrc = _.find('img').attr('src');
		var getURL = 'data/data.json';

		if (!people) return;

		if (people === '李冰冰') getURL = 'data/data2.json';

		_.parents('ul').addClass('hide-list');
		box.addClass('loading');


		setTimeout(function() {

			var _doCallback = function(obj) {

				_.parents('ul').removeClass('hide-list');

				box.removeClass('loading')
				.find('img').attr('src', imgSrc)
				.next().text(people)
				.end().end()
				.find('.title-inner').find('p').text(people);
				
				$('.relationship-list').html(getUlList(obj.relationshipArr))
				setMap()
				
			}


			getAjaxObj(getURL, _doCallback)


		}, 3000)

	})
	.mousedown(function(e) {
		isHolder = true;
		moveObj.x = e.pageX;
		moveObj.y = e.pageY;
		var box = $('.usr-relationship-map');
		moveObj.top = box.offset().top;
		moveObj.left = box.offset().left;

		$(this).css('cursor', 'move')
	})
	.mouseup(function(e) {
		isHolder = false;

		$(this).css('cursor', 'default')
	})
	.mousemove(function(e) {

		if (isHolder) {
			var moveX = e.pageX - moveObj.x;
			var moveY = e.pageY - moveObj.y;

			$('.usr-relationship-map').css({
				top :  moveObj.top + moveY,
				left : moveObj.left + moveX
			});
			
		}
	});


});

/*
	请求数据
	---------------------------------------
	@url 地址
	@doCallback 成功运行
	@errCallback 失败运行
*/
function getAjaxObj(url, doCallback, errCallback) {

	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json'
	})
	.done(function(obj) {
		doCallback(obj)
		
	})
	.fail(function(err) {
		errCallback()
		
	})
}


/*
	设置散落的人物
	-------------------------------------------
	@obj

*/
function setLiDeg(obj) {
	var _  = obj.find('li')
	var length = _.length;
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var liDeg = 360 / length;

	winW = winW > 1000 ? winW : 1000;
	winH = winH > 800 ? winH : 800;

	_.each(function() {
		var _deg = $(this).index() * liDeg - Math.random() * (liDeg/2);
		var _liLen = Math.min(winW, winH);
		var _w = _liLen/2 - Math.random() * _liLen/4;
		var _boxSize = 70 + _w / (_liLen/2) * 30;

		$(this).css({
			'-webkit-transform': 'rotateZ('+ _deg +'deg)',
			'-moz-transform': 'rotateZ('+ _deg +'deg)',
			'-ms-transform': 'rotateZ('+ _deg +'deg)',
			'-o-transform': 'rotateZ('+ _deg +'deg)',
			'transform': 'rotateZ('+ _deg +'deg)',
			'width': _w
		})
		.children('.relate-box').css({
			'width': _boxSize,
			'height': _boxSize,
			'-webkit-transform': 'rotateZ('+ - _deg +'deg)',
			'-moz-transform': 'rotateZ('+ - _deg +'deg)',
			'-ms-transform': 'rotateZ('+ - _deg +'deg)',
			'-o-transform': 'rotateZ('+ - _deg +'deg)',
			'transform': 'rotateZ('+ - _deg +'deg)'
		})
		.next().css({
			'-webkit-transform': 'rotateZ('+ - _deg +'deg)',
			'-moz-transform': 'rotateZ('+ - _deg +'deg)',
			'-ms-transform': 'rotateZ('+ - _deg +'deg)',
			'-o-transform': 'rotateZ('+ - _deg +'deg)',
			'transform': 'rotateZ('+ - _deg +'deg)'
		});

	});

}

// 生成用户信息
function generateHTMLMAP (json) {
	var html = '<div class="usr-relationship-map">';

	var getUsr = function(usrInfo) {
		var _html = '<div class="usr-main-box"><div class="usr-head-ico">';
		_html += '<img src="'+usrInfo.ico+'" alt="'+usrInfo.name+'"><p>'+usrInfo.name+'</p></div>';
		_html += '<div class="title-msg bottomTitMsg"><div class="title-inner"><p>'+usrInfo.name+'</p></div></div></div>'
		return _html;
	}



	html += getUsr(json.usr);
	html += '<div class="relationship-list">';
	html += getUlList(json.relationshipArr);
	html += '</div>';


	return html;
}

/* 
	拼装用户信息
	@list 用户信息;例如 data.relationshipArr
*/
function getUlList(list) {
	var listLen = list.length;

	var backLiHTML = function() {
		var _html = '<li><div class="relate-box"><div class="usr-head-ico back-btn">'
		_html += '返回</div></div>'
		_html += '<div class="relate-description"><span>返回</span></div></li>'

		return _html;
	}

	html = '<ul>';

	for (var i = 0; i < listLen; i++) {
		if (!(i%10) && i !== 0) {
			console.log(i)

			if (i !== 10) {
				html += backLiHTML();				
			}

			html += '<li><div class="relate-box"><div class="usr-head-ico next-btn">'
			html += '更多</div></div>'
			html += '<div class="relate-description"><span>查看更多</span></div></li>'
			html += '</ul><ul>'
		};

		html += '<li><div class="relate-box"><div class="usr-head-ico" style="background: rgb('+ list[i].relationship.color +')">'
		html += '<img src="' + list[i].ico + '" alt="' + list[i].name + '">'
		html += '<p style="background:rgba('+list[i].relationship.color+',.6")>' + list[i].name + '</p></div><div class="title-msg bottomTitMsg">'
		html += '<div class="title-inner"><p>' + list[i].name + '</p><p class="see-this-info">查看详情</p></div>'
		html += '</div></div><div class="relate-description"><span>'+ list[i].relationship.description +'</span></div></li>';

		if (i === listLen -1) {
			html += backLiHTML(html);
		}
	}

	return html
}

// 设置图谱
function setMap() {
	
	$('.relationship-list ul').each(function() {
		var id = this.id;
		console.log(id)
		setLiDeg($(this))
	});

	$('.relationship-list ul:first').addClass('first-fade-list');

}

// 隐藏信息层
function hideInfoLayer () {
	var _div = $('.usr-info-mod');
	var _class = 'slideDwon-fadeOut';

	_div.removeClass('slideUp-fadeIn').addClass(_class);

	setTimeout(function() {
		_div.hide().removeClass(_class)
	}, 300);
}