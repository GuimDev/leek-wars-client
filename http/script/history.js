LW.pages.history.init = function(params, $scope, $page) {

	var id = params.id
	var type = params.type

	_.get('history/get-' + type + '-history/' + id, function(data) {

		if (data.success == false) {
			LW.error(
				_.lang.get('history', 'not_found_id', [id]),
				_.lang.get('history', 'not_found_id', [id])
			)
			return
		}

		$scope.fights = data.fights
		$scope.entity = data.entity

		$page.render()
		LW.setTitle(_.lang.get('history', 'title', data.entity.name))

		if (type == 'leek') {
			LW.createLeekImage(data.entity.id, 0.8, data.entity.level, data.entity.skin, data.entity.hat, function(id, data) {
				$('#history-page .summary .image').html(data)
			})
		} else if (type == 'farmer') {
			$('#history-page .summary .image img').attr('src', _.view.render('main.avatar', data.entity))
		}

		var select_period = function(period) {
			var now = Date.now() / 1000
			var midnignt = new Date()
			midnignt.setHours(0, 0, 0, 0)
			var day = 24 * 3600
			var start_date = function() {
				if (period == '24h') return now - day
				if (period == 'today') return midnignt.getTime() / 1000
				if (period == '2days') return now - 2 * day
				if (period == '1week') return now - 7 * day
			}()
			filter_fights(start_date)
		}

		var filter_fights = function(start_date) {
			var count = 0
			var victories = 0
			var defeats = 0
			var draws = 0
			$('#history-page .fight').each(function() {
				var visible = parseInt($(this).attr('date')) >= start_date
				$(this).toggle(visible)
				if (visible) {
					count++
					if ($(this).hasClass('win')) victories++
					if ($(this).hasClass('defeat')) defeats++
					if ($(this).hasClass('draw')) draws++
				}
			})
			$('#history-page .n-fights').html(_.lang.get('history', 'n_fights', count))
			$('#history-page .victories').text(victories)
			$('#history-page .draws').text(draws)
			$('#history-page .defeats').text(defeats)
			var ratio = defeats == 0 ? victories : _.format.numberPrecision(victories / defeats, 3)
			$('#history-page .ratio').text(ratio)
		}

		$('#history-page .period').click(function() {
			$('#history-page .period').removeClass('selected')
			$(this).addClass('selected')
			var period = $(this).attr('period')
			select_period(period)
		})

		select_period('1week')
	})
}
