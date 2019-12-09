/*
 * 入力チェック
 **/
function check_input () {
	// --- フォームのデータを取得
	var params = $("#frm1").serialize();
	
	// --- エラークラスを取り外す
	$("." + $("#errorclass").val()).removeClass( $("#errorclass").val() );
	
	// --- 入力チェックを行う
	$.post(
		"formmail.php?mode=chk",
		{
			params : params
		},
		function ( data, status ) {
			if ( data == "OK" ) {
				location.href = 'formmail.php?mode=view';
				return false;
			} else {
				$("#error").val( data );
				set_error();
				alert("入力内容を確認してください。");
			}
		}
	);
}


/*
 * エラーの表示
 **/
function set_error () {
	// --- エラーリストの取得
	var errorlist = $("#error").val();
	
	// --- エラー項目を分解（,区切り）
	var arr_error = errorlist.split(",");
	
	// --- エラークラスを取得
	var errorclass = $("#errorclass").val();
	
	// --- エラー項目にクラスを追加
	for ( var i = 0; i < arr_error.length; i++ ) {
		$("." + arr_error[i]).addClass( errorclass );
	}
}