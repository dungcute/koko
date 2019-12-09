jkmegamenu.definemenu("fdtBtn", "fdtMm", "click");
$(function() {
var appendTimeout;
function appendText(text) {
clearTimeout(appendTimeout);
appendTimeout= setTimeout(function() {
$("option", $("#fdtMm > div select[class='ui-datepicker-year']")).each(function(){$(this).text($(this).text() + text);});
$("#fdtMm > div span[class='ui-datepicker-year']").each(function(){$(this).html($(this).html() + text);});
}, 50);
}
function fmtMdhmsElm(d) {
return ( d < 10 ? "0" : "") + d;
}
function fmtDt(date) {
return date.getFullYear() + fmtMdhmsElm(date.getMonth()+1) + fmtMdhmsElm(date.getDate());
}
// 本日日付を取得
//var baseDate = $.datepicker.formatDate('yymmdd', new Date());
// 翌日日付を取得
var baseDate = $.datepicker.formatDate('yymmdd', getTommorow());
// 最小日付の算出
var minDate = baseDate;
if (dtProps.startDt != undefined && dtProps.startDt != '' && dtProps.startDt > minDate) {
minDate = $.datepicker.formatDate('yymmdd', $.datepicker.parseDate('yymmdd', dtProps.startDt));
}
var minDt = [minDate.substring(0, 4), minDate.substring(4, 6), minDate.substring(6)].join('/');
// 初期選択日付の算出
var defDt = minDate;
if (dtProps.startMargin != undefined && dtProps.startMargin != '') {
defDt = $.datepicker.formatDate('yymmdd', computeDate(minDate.substring(0, 4), minDate.substring(4, 6), minDate.substring(6), dtProps.startMargin));
}
defDt = [defDt.substring(0, 4), defDt.substring(4, 6), defDt.substring(6)].join('/');
// 最大日付の算出
var maxDate = minDate;
if (dtProps.endDt != undefined && dtProps.endDt != '' && dtProps.endDt > minDate) {
maxDate = $.datepicker.formatDate('yymmdd', $.datepicker.parseDate('yymmdd', dtProps.endDt));
}
var periodDate = convertPeriodToAbsoluteYyyymmdd(minDate, '6M');
if (dtProps.period != undefined && dtProps.period != '') {
periodDate = convertPeriodToAbsoluteYyyymmdd(minDate, dtProps.period);
}
var maxDt = [maxDate.substring(0, 4), maxDate.substring(4, 6), maxDate.substring(6)].join('/');
if (periodDate < maxDate) {
maxDt = [periodDate.substring(0, 4), periodDate.substring(4, 6), periodDate.substring(6)].join('/');
}
$(":input[name='fdt']").val(defDt);
$.datepicker.setDefaults($.datepicker.regional['ja']);
$("#fdtMm > div").datepicker({
dateFormat      : 'yy/mm/dd',
numberOfMonths  : 2,
minDate         : minDt,
maxDate         : maxDt,
yearRange       : '0:c+2',
changeYear      : true,
changeMonth     : true,
defaultDate     : defDt,
prevText        : '',
nextText        : '',
yearSuffix      : '',
showMonthAfterYear: true,
onChangeMonthYear : function(year, month, inst) {
appendText('年');
},
onSelect        : function(dateText, inst){
$(":input[name='fdt']").val(dateText).trigger('change');
jkmegamenu.hidemenu($('#fdtMm'), parseInt($('#fdtMm').attr('_megamenupos')));
}
}).delegate('select,.ui-datepicker-prev,.ui-datepicker-next', 'click mouseleave', function(){return false;}).ready(appendText('年'));
});