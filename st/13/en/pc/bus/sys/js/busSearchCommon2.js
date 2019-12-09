$(function() {

	//最大人数
	var maxNinzu         = 9;
	//県表示行数
	var kenRowCount      = 2;
	//都市表示行数
	var toshiRowCount    = 10;
	//非表示対象スタイルシートクラス名
	var hideStyleClassName = "skb_hide";
	//選択中の背景色
	var selectedBackgroundColor = "#ffcc66";
	//エリア未選択時のテキスト内容
	var unselectAreaText = "全てのエリア";

	// エラーメッセージ
	var errorMaxNinzu    = "ご利用人数の合計は" + maxNinzu + "名以下で入力してください";
	var errorShuppatsu   = "出発地を選択してください";
	var errorTochaku     = "目的地を選択してください";
	var errorNinzu       = "ご利用人数を選択してください";
	var errorShuppatsuDt = "出発日の日付が不正です\r\n正しい日付を入力してください";
	var errorSdtAfter    = "出発日は本日以降の日付を入力してください";
	var errorTochakuDt   = "復路出発日の日付が不正です\r\n正しい日付を入力してください";
	var errorTdtAfter    = "復路出発日は往路出発日以降の日付を入力してください";

	//都市情報設定
	function fillToshiBlock(kenCd, $toshiWrapper, callback) {
		$toshiWrapper.empty();
		if ('kenToshiMap' in window) {
			if (!!kenCd) {
				var toshiMap = kenToshiMap[kenCd];
				if (!!toshiMap) {
					$toshiWrapper.show();
					var createAndAppendUlToshi = function() {return $("<ul class='arw_'>").appendTo($toshiWrapper);};
					var $ulToshi = createAndAppendUlToshi();
					var liCount = 0;
					for (var toshiCd in toshiMap) {
						$ulToshi.append($('<li>').text(toshiMap[toshiCd]).data('toshiCd', toshiCd));
						liCount++;
						if (liCount >= toshiRowCount) {
							var $ulToshi = createAndAppendUlToshi();
							liCount = 0;
						}
					}

				}
			}
			$(".inputdata125[_megamenupos='" + $toshiWrapper.parent().attr('_megamenupos') + "']").toggle($('#skb').val() !== '01' && (!!kenCd && isDispToshi(kenCd)) && !!kenToshiMap[kenCd]);
			$(".inputdata[_megamenupos='" + $toshiWrapper.parent().attr('_megamenupos') + "']").toggle($('#skb').val() !== '01' && (!!kenCd && isDispToshi(kenCd)) && !!kenToshiMap[kenCd]);
			if (!!callback) {
				callback();
			}
		}
	}
	//出発地域一覧取得
	function findFromChiikiArr() {
		var fromKenCdArr = [];
		for (var fromKenCd in kenFromToMap) {
			fromKenCdArr.push(fromKenCd);
		}
		return convKenToChiikiArr(fromKenCdArr.sort());
	}

	//県一覧を地域毎にまとめる
	//[kenCd1,kenCd2...]＝＞[chiikiCd1,[kenCd1,kenCd2...]],[chiikiCd2,[kenCd1,kenCd2...]]...]
	function convKenToChiikiArr(kenCdArr) {
		if (!kenCdArr) {
			return [];
		}
		var chiikiArr = [];
		for (var i = 0; i < kenCdArr.length; i++) {
			var kenCd = kenCdArr[i];
			var chiikiCd = findChiikiCdByPk(kenCd);
			var found = false;
			for (var j = 0; j < chiikiArr.length; j++ ) {
				if ( chiikiArr[j][0] == chiikiCd ) {
					chiikiArr[j][1].push(kenCd);
					found = true;
					break;
				}
			}
			if (!found) {
				var chiiki = [];
				chiiki.push(chiikiCd);
				chiiki.push([kenCd]);
				chiikiArr.push(chiiki);
			}
		}
		chiikiArr.sort(function(a,b){return a[0] > b[0]});
		return chiikiArr;
	}

	//県情報出力
	function renderKen(chiikiArr, $destDiv) {
		$destDiv.empty();
		var $divlow = $('<div class="low_"></div>');
		for ( var i = 0; i < chiikiArr.length; i++ ) {
			var chiiki = chiikiArr[i];	//[0]=>chiikiCd,[1]=>kenCdArr
			var $temp = $("<div class='column'></div>");
			$("<h3>" + findChiikiNameByPk(chiiki[0]) + "</h3>").appendTo($temp);
			var $temp2 = $("<ul class='arw_'></ul>").appendTo($temp);
			var kenCdArr = chiiki[1];
			for ( var j = 0; j < kenCdArr.length; j++ ) {
				var kenCd = kenCdArr[j];
				$("<li>"+ findKenNameByPk(kenCd) +"</li>").data('kenCd', kenCd).appendTo($temp2);
			}
			$temp.appendTo($divlow);
		}
		$divlow.appendTo($destDiv);
	}
	//地域CD=>地域名変換
	function findChiikiNameByPk(chiikiCd) {return chiikiList[chiikiCd];}
	//県CD=>県名変換
	function findKenNameByPk(kenCd) {return kenList[kenCd][0];}
	//県CD=>地域CD変換
	function findChiikiCdByPk(kenCd) {return kenList[kenCd][1];}
	//都市表示有無
	function isDispToshi(kenCd) {
		var $searchKb = $(":hidden[name='skb']");
		return $searchKb.val() === '03' || $searchKb.val() === '04' ||  kenList[kenCd][2] == '1';
	}

	var $divFromKen      = $("#goregion-mm div.column-container");
	var $divFromArea     = $("#golocal-mm div.column-container");
	var $divToKen        = $("#toregion-mm div.column-container");
	var $divToArea       = $("#tolocal-mm div.column-container");

	var $txtFromKen      = $("#goregion").val('');
	var $labelFromKen    = $("#fromKenLabel").text('');
	var $txtFromArea     = $("#golocal").val(unselectAreaText);
	var $txtToKen        = $("#toregion").val('');
	var $labelToKen      = $("#toKenLabel").text('');
	var $txtToArea       = $("#tolocal").val(unselectAreaText);

	var $hdnFromKen      = $(":hidden[name='sk']");
	var $hdnFromArea     = $(":hidden[name='sa']");
	var $hdnToKen        = $(":hidden[name='tk']");
	var $hdnToArea       = $(":hidden[name='ta']");

	var $btnReverse      = $("#reverseFromTo");	//逆表示ボタン
	var $searchKb        = $(":hidden[name='skb']");

	$("#golocal-mm div.delez a").click(function(e) {
		e.preventDefault();
		$txtFromArea.val(unselectAreaText);
		$hdnFromArea.val('');
		$("li", $divFromArea).css('background-color', '');
	});
	$("#tolocal-mm div.delez a").click(function(e) {
		e.preventDefault();
		$txtToArea.val(unselectAreaText);
		$hdnToArea.val('');
		$("li", $divToArea).css('background-color', '');
	});
	//出発県メニュー設定
	if ($divFromKen.size() > 0) {
		renderKen(findFromChiikiArr(), $divFromKen);
	}

	//出発県選択EventHandler
	$("li", $divFromKen).live("click", function() {
		var kenCd = $(this).data('kenCd');
		$txtFromKen.val($(this).text());
		$labelFromKen.text($(this).text());
		$hdnFromKen.val(kenCd);
		$txtFromArea.val(unselectAreaText);
		$hdnFromArea.val('');
		$txtToKen.val('');
		$labelToKen.text('');
		$hdnToKen.val('');
		$txtToArea.val(unselectAreaText);
		$hdnToArea.val('');
		fillToshiBlock($hdnFromKen.val(), $divFromArea);	//出発エリアメニュー設定
		fillToshiBlock($hdnToKen.val(), $divToArea);	//出発エリアメニュー設定
		renderKen(convKenToChiikiArr(kenFromToMap[kenCd]), $divToKen);	//到着県メニュー設定
		var selectedColor = $(this).css('background-color');
		$("li", $divFromKen).css('background-color', '');
		$(this).css('background-color', selectedBackgroundColor);
	});

	//出発エリア選択EventHandler
	$("li", $divFromArea).live("click", function() {
		$txtFromArea.val($(this).text());
		$hdnFromArea.val($(this).data('toshiCd'));
		$("li", $divFromArea).css('background-color', '');
		$(this).css('background-color', selectedBackgroundColor);
	});

	//到着県選択EventHandler
	$("li", $divToKen).live("click", function() {
		var kenCd = $(this).data('kenCd');
		$txtToKen.val($(this).text());
		$labelToKen.text($(this).text());
		$hdnToKen.val(kenCd);
		$txtToArea.val(unselectAreaText);
		$hdnToArea.val('');
		fillToshiBlock($hdnToKen.val(), $divToArea);	//到着エリアメニュー設定
		$("li", $divToKen).css('background-color', '');
		$(this).css('background-color', selectedBackgroundColor);
	});

	//到着エリア選択EventHandler
	$("li", $divToArea).live("click", function() {
		$txtToArea.val($(this).text());
		$hdnToArea.val($(this).data('toshiCd'));
		$("li", $divToArea).css('background-color', '');
		$(this).css('background-color', selectedBackgroundColor);
	});

	//逆表示ボタン押下
	$btnReverse.click(function() {
		var tmp;
		tmp = $txtFromKen.val(),  $txtFromKen.val($txtToKen.val()),   $txtToKen.val(tmp);
		tmp = $labelFromKen.text(),  $labelFromKen.text($labelToKen.text()),   $labelToKen.text(tmp);
		tmp = $txtFromArea.val(), $txtFromArea.val($txtToArea.val()), $txtToArea.val(tmp);
		tmp = $hdnFromKen.val(),  $hdnFromKen.val($hdnToKen.val()),   $hdnToKen.val(tmp);
		tmp = $hdnFromArea.val(), $hdnFromArea.val($hdnToArea.val()), $hdnToArea.val(tmp);
		renderKen(convKenToChiikiArr(kenFromToMap[$hdnFromKen.val()]), $divToKen);	//到着県メニュー設定
		fillToshiBlock($hdnFromKen.val(), $divFromArea);
		fillToshiBlock($hdnToKen.val(), $divToArea);
		return false;
	});

	var $ofDisp = $(".ofDisp");

	$(":input[name='of']").click(switchOfuku).filter(':checked').triggerHandler('click');

	// 片道か往復かで表示項目を切り替え
	function switchOfuku() {
		if ($(this).val() == '1') {
			$ofDisp.show();
			//$('#sdtBtn').removeClass('inputcal125').addClass('inputcal');
		} else {
			$ofDisp.hide();
			//$('#sdtBtn').removeClass('inputcal').addClass('inputcal125');
		}
	}

	var validDate = function(yyyymmdd) {
		var vYear = yyyymmdd.substr(0, 4) - 0;
		var vMonth = yyyymmdd.substr(4, 2) - 1;
		var vDay = yyyymmdd.substr(6, 2) - 0;
		// 月,日の妥当性チェック
		if(vMonth >= 0 && vMonth <= 11 && vDay >= 1 && vDay <= 31) {
			var vDt = new Date(vYear, vMonth, vDay);
			if (isNaN(vDt)) {
					return false;
			} else if(vDt.getFullYear() == vYear && vDt.getMonth() == vMonth && vDt.getDate() == vDay) {
					return true;
			} else {
					return false;
			}
		} else {
			return false;
		}
	}

	$('#searchBtn,.searchBtn').not('.dp').click(function(e) {
		// 出発地必須チェック
		var $sk = $(":hidden[name='sk']");
		if ($sk.size() > 0) {
			if (!$sk.val()) {
				// 出発地が選択されていません
				alert(errorShuppatsu);
				return false;
			}
		}
		// 目的地必須チェック
		var $tk = $(":hidden[name='tk']");
		if ($tk.size() > 0) {
			if (!$tk.val()) {
				// 目的地が選択されていません
				alert(errorTochaku);
				return false;
			}
		}
		// 乗車人数チェック
		var $mn = $("select[name='mn']");
		var $fn = $("select[name='fn']");
		if ($mn.size() > 0 && $fn.size() > 0) {
			if (~~$mn.val() == 0 && ~~$fn.val() == 0) {
				// 男性利用人数、女性利用人数のいずれかに1以上の値を入力してください
				alert(errorNinzu);
				return false;
			}
			if (~~$mn.val() + ~~$fn.val() > maxNinzu) {
				alert(errorMaxNinzu);
				return false;
			}
		}
		// 出発日・復路出発日チェック
		var $sdt = $(":text[name='sdt']");
		if ($sdt.size() > 0) {
			var vSdt = $sdt.val().replace(/\//g, '');
			var sdtPrefix = $('#sdtMm .ofDisp').filter(function(){return $(this).css('display') != 'none';}).text();
			if (!validDate(vSdt)) {
				// 出発日チェック
				alert(sdtPrefix + errorShuppatsuDt);
				return false;
			}

			var date = new Date();
			var accessYyyymmdd = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2);

			if (vSdt < accessYyyymmdd) {
				// 今日 < 出発日チェック
				alert(sdtPrefix + errorSdtAfter);
				return false;
			}
			if ($("#of1:checked").val() == '1') {
				var $fdt = $(":text[name='fdt']");
				if ($fdt.size() > 0) {
					var vFdt = $fdt.val().replace(/\//g, '');
					if (!validDate(vFdt)) {
						// 復路出発日チェック
						alert(errorTochakuDt);
						return false;
					}
					if (vFdt < vSdt) {
						// 往路出発日 < 復路出発日チェック
						alert(errorTdtAfter);
						return false;
					}
				}
			}
		}
		if ($(this).is(':not(:image,:submit)')) {
			$(this).closest('form').submit();
		}
	});

	if (!$('#skb').val()) {
		$('#skb').val('02');
	}
	if ($searchKb.val() !== '05') {
		$('#fromKenBtn,#toKenBtn').toggle($searchKb.val() === '01' || $searchKb.val() === '02');
		$('#fromKenLabel,#toKenLabel').toggle($searchKb.val() === '04');
		$(".inputdata125[_megamenupos='" + $divFromArea.parent().attr('_megamenupos') + "']").hide();
		$(".inputdata125[_megamenupos='" + $divToArea.parent().attr('_megamenupos') + "']").hide();
		$(".inputdata[_megamenupos='" + $divFromArea.parent().attr('_megamenupos') + "']").hide();
		$(".inputdata[_megamenupos='" + $divToArea.parent().attr('_megamenupos') + "']").hide();
	} else {
		$('.' + hideStyleClassName).hide();
	}
	if ($('#osf').val() === '0') {
		$("[name='of']").each(function() {
			$(this).add($("label[for='" + $(this).filter(':not(:checked)').attr('id') + "']")).hide();
		});
	}
	$('#sdt,#fdt').each(function() {
		if (!$(this).val()) {
			var date = new Date();
			$(this).val(date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2));
		}
	});

	$('#sdt').change(function() {
		var vSdt = $(this).val();
		var vFdt = $('#fdt').val();
		if (vFdt < vSdt) {
			var date = new Date(vSdt);
			date.setDate(date.getDate() + 1);
			$('#fdt').val([date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join( '/' ));
			$(".megamenu[_megamenupos='" + $('#fdtBtn').attr('_megamenupos') + "']").children('div').datepicker('setDate', date);
		}
	});

	//出発県メニュー設定
	if ($divFromKen.size() > 0) {
		var $initFromKen = $("li", $divFromKen).filter(function() {return $(this).data('kenCd') === $hdnFromKen.val();});
		$initFromKen.css('background-color', selectedBackgroundColor);
		$txtFromKen.val($initFromKen.text());
		$labelFromKen.text($initFromKen.text());
		//出発エリアメニュー設定
		fillToshiBlock($hdnFromKen.val(), $divFromArea, function(){
			//出発エリア選択
			var $initFromArea = $("li", $divFromArea).filter(function() {return $(this).data('toshiCd') === $hdnFromArea.val();});
			$txtFromArea.val($initFromArea.text() || unselectAreaText);
			$hdnFromArea.val($initFromArea.data('toshiCd'));
			$initFromArea.css('background-color', selectedBackgroundColor);
		});
	}

	//到着県メニュー設定
	if ($divToKen.size() > 0) {
		renderKen(convKenToChiikiArr(kenFromToMap[$initFromKen.data('kenCd')]), $divToKen);
		var $initToKen = $("li", $divToKen).filter(function() {return $(this).data('kenCd') === $hdnToKen.val();});
		$initToKen.css('background-color', selectedBackgroundColor);
		$txtToKen.val($initToKen.text());
		$labelToKen.text($initToKen.text());
		//到着エリアメニュー設定
		fillToshiBlock($hdnToKen.val(), $divToArea, function(){
			//到着エリア選択
			var $initToArea = $("li", $divToArea).filter(function() {return $(this).data('toshiCd') === $hdnToArea.val();});
			$txtToArea.val($initToArea.text() || unselectAreaText);
			$hdnToArea.val($initToArea.data('toshiCd'));
			$initToArea.css('background-color', selectedBackgroundColor);
		});
	}
});

// 対象月の末日を取得する。
function getMonthEndDay(year, month) {
    var dt = new Date(year, month, 0);
    return dt.getDate();
}
// 日加算
function computeDate(year, month, day, addDays) {
	var dt = new Date(year, month - 1, day);
	dt.setTime(dt.getTime() + (addDays * 86400000));
	return dt;
}
// 月加算
function computeMonth(year, month, day, addMonths) {
    month += addMonths;
    var endDay = getMonthEndDay(year, month);
    if(day > endDay) day = endDay;
    var dt = new Date(year, month - 1, day);
    return dt;
}

// 期間指定からの日付取得処理
function convertPeriodToAbsoluteYyyymmdd(baseYyyymmdd, rel) {
	var absoluteDate;

	var m = rel.match(/^(\d+)(D|M|)?$/);
	if (m == null || m[1] == undefined || m[2] == undefined) {
		return;
	}
	var value = ~~m[1];
	var period = m[2];
	if (period == 'D') {
		absoluteDate = computeDate(baseYyyymmdd.substring(0, 4), ~~baseYyyymmdd.substring(4, 6), ~~baseYyyymmdd.substring(6), value);
	} else if (period == 'M') {
		absoluteDate = computeMonth(baseYyyymmdd.substring(0, 4), ~~baseYyyymmdd.substring(4, 6), ~~baseYyyymmdd.substring(6), value);
	}

	return $.datepicker.formatDate('yymmdd', absoluteDate);
}

// 明日の日付を取得
function getTommorow() {
	var nowDate = new Date();
	return new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1);
}
