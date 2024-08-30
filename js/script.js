document.querySelector('.clear_button').addEventListener('click', function() {
	document.getElementById('task').value = '';
	document.getElementById('task').focus();
});


$(document).ready(function() {
	function loadTaskCounts() {
			$.ajax({
					url: 'vender/get_task_counts.php',
					method: 'GET',
					dataType: 'json',
					success: function(counts) {
							$('#count_open').text('Открыто - ' + counts.count_open);
							$('#count_in_progress').text('В работе - ' + counts.count_in_progress);
							$('#count_closed').text('Закрыто - ' + counts.count_closed);
					},
					error: function(xhr, status, error) {
							console.error('Ошибка при получении данных: ', error);
					}
			});
	}
	loadTaskCounts();
});


$(document).ready(function() {
	function loadTasks() {
			$.ajax({
					url: 'vender/get_tasks.php',
					method: 'GET',
					dataType: 'json',
					success: function(tasks) {
							console.log(tasks);
							let html = '';
							if (tasks && tasks.length > 0) {
									tasks.forEach(function(task) {
											console.log(task);
											html += '<div class="task_status_item" data-task-id="' + task.id + '">' +
																	'<p class="text_task_staus">' + task.task + '</p>' +
																	'<div class="block_status_for_task">' +
																			'<button class="btn_status_for_task">' + (task.status_name || 'Неизвестен') + '</button>' +
																	'</div>' +
															'</div>';
									});
									$('#task_list').html(html);
							}
					},
					error: function(xhr, status, error) {
							console.error('Ошибка при получении задач: ', error);
					}
			});
	}
	loadTasks();
});



$(document).ready(function() {
	var maxVisibleTasks = 5;
	var isExpanded = false;

	function updateButtonVisibility() {
			var totalTasks = $('#task_list .task_status_item').length;
			if (totalTasks > maxVisibleTasks) {
					$('.see_more').show();
			} else {
					$('.see_more').hide();
			}
	}


	$.ajax({
			url: 'vender/get_task_counts.php',
			method: 'GET',
			dataType: 'json',
			success: function(data) {
					var totalTasks = data.count_open + data.count_in_progress + data.count_closed;
					var taskItems = $('#task_list .task_status_item');

					if (totalTasks > maxVisibleTasks) {
							taskItems.slice(maxVisibleTasks).hide();
					}
					updateButtonVisibility();

					$('.see_more').click(function() {
							if (isExpanded) {
									taskItems.slice(maxVisibleTasks).hide();
									$(this).html('Показать еще <img src="image/check_mark.png" class="img_check_mark" alt="Button check mark">');
							} else {
									taskItems.show();
									$(this).html('Скрыть <img src="image/check_mark_revers.png" class="img_check_mark" alt="Button check mark">');
							}
							isExpanded = !isExpanded;
					});
			},
			error: function(jqXHR, textStatus, errorThrown) {
					console.error('Ошибка получения данных: ' + textStatus, errorThrown);
			}
	});
});


$(document).ready(function() {
	function loadTasks() {
			$.ajax({
					url: 'vender/get_tasks_for_board.php',
					method: 'GET',
					dataType: 'json',
					success: function(tasks) {
							console.log('Полученные данные:', tasks);

							$('.task_open').empty();
							$('.task_at_work').empty();
							$('.task_close').empty();

							tasks.open.forEach(function(task) {
									$('.task_open').append(
											`<div class="task_item" data-task-id="${task.id}">
													<p>${task.task}</p>
											</div>`
									);
							});
							tasks.in_progress.forEach(function(task) {
									$('.task_at_work').append(
											`<div class="task_item" data-task-id="${task.id}">
													<p>${task.task}</p>
											</div>`
									);
							});
							tasks.closed.forEach(function(task) {
									$('.task_close').append(
											`<div class="task_item" data-task-id="${task.id}">
													<p>${task.task}</p>
											</div>`
									);
							});
					},
					error: function(xhr, status, error) {
							console.error('Ошибка при получении задач: ', error);
					}
			});
	}
	loadTasks();
});


$(document).ready(function() {
	let currentTaskId = null;

	$(document).on('click', '.btn_status_for_task', function() {
			$currentTaskStatusItem = $(this).closest('.task_status_item');
			currentTaskId = $currentTaskStatusItem.data('task-id');
			var $textTaskStaus = $currentTaskStatusItem.find('.text_task_staus');

			if ($textTaskStaus.length) {
					var taskText = $textTaskStaus.text().trim();
					$('#popup_task').val(taskText);
			}

			$('.overlay').addClass('active');
			$('#popup').show();
	});

	$(document).on('click', '.btn_applay', function() {
    if (currentTaskId) {
        var newTaskText = $('#popup_task').val().trim();

        $.ajax({
            url: 'vender/update_task.php',
            method: 'POST',
            data: {
                id: currentTaskId,
                task: newTaskText
            },
            success: function(response) {
                console.log('Ответ сервера:', response);
                try {
                    var result = JSON.parse(response);
                    if (result.status === 'success') {
                        console.log('Задача успешно обновлена');
                        $('#popup').hide();
                        $('.overlay').removeClass('active');
                        currentTaskId = null;
                        location.reload();
                    } else {
                        console.log('Ошибка обновления:', result.message);
                        alert('Ошибка: ' + result.message);
                    }
                } catch (e) {
                    console.error('Ошибка парсинга JSON ответа:', e);
                    alert('Ошибка обработки ответа сервера.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Ошибка AJAX:', status, error);
                alert('Ошибка при обновлении задачи. Попробуйте снова.');
            }
        });
    } else {
        alert('ID задачи не установлен. Пожалуйста, выберите задачу.');
    }
});


	$(document).on('click', '.btn_back, .overlay', function() {
			$('#popup').hide();
			$('.overlay').removeClass('active');
			currentTaskId = null;
	});

	$(document).on('click', '.btn_delete', function() {
    if (currentTaskId) {
        $.ajax({
            url: 'vender/delete_task.php',
            method: 'POST',
            data: { id: currentTaskId },
            success: function(response) {
                console.log('Ответ сервера:', response);
                try {
                    var result = JSON.parse(response);
                    if (result.status === 'success') {
                        console.log('Задача успешно удалена');
                        $('#popup').hide();
                        $('.overlay').removeClass('active');
                        location.reload();
                    } else {
                        console.log('Ошибка удаления:', result.message);
                    }
                } catch (e) {
                    console.error('Ошибка парсинга JSON ответа:', e);
                }
            },
            error: function(xhr, status, error) {
                console.error('Ошибка AJAX:', status, error);
            }
        });
    } else {
        console.error('Идентификатор задачи не найден.');
    }
});
});


$(document).ready(function() {
	var currentTaskId = null;
	$(document).on('click', '.task_status_item', function() {
			currentTaskId = $(this).data('task-id');
			console.log('Task ID установлен:', currentTaskId);
	});

	$(document).on('click', '.btn_status', function() {
			if (currentTaskId) {
					var newStatusId = $(this).data('status-id');

					$.ajax({
							url: 'vender/update_task_status.php',
							method: 'POST',
							data: {
									id: currentTaskId,
									status: newStatusId
							},
							success: function(response) {
									console.log('Ответ сервера:', response);
									try {
											var result = JSON.parse(response);
											if (result.status === 'success') {
													console.log('Статус задачи успешно обновлен');
													location.reload();
											} else {
													console.log('Ошибка обновления статуса:', result.message);
													alert('Ошибка: ' + result.message);
											}
									} catch (e) {
											console.error('Ошибка парсинга JSON ответа:', e);
											alert('Ошибка обработки ответа сервера.');
									}
							},
							error: function(xhr, status, error) {
									console.error('Ошибка AJAX:', status, error);
									alert('Ошибка при обновлении статуса задачи. Попробуйте снова.');
							}
					});
			} else {
					alert('ID задачи не установлен. Пожалуйста, выберите задачу.');
			}
	});
});


$(document).ready(function() {
	$(document).on('mouseenter', '.task_item', function() {
			$(this).draggable({
					revert: "invalid",
					helper: "clone",
					start: function(event, ui) {
							$(this).addClass("dragging");
					},
					stop: function(event, ui) {
							$(this).removeClass("dragging");
					}
			});
	});

	$(".column").droppable({
			accept: ".task_item",
			drop: function(event, ui) {
					var $this = $(this);
					var taskId = ui.draggable.data("task-id");
					var newStatusId;

					switch ($this.attr("id")) {
							case "open":
									newStatusId = 1;
									break;
							case "in_progress":
									newStatusId = 2;
									break;
							case "closed":
									newStatusId = 3;
									break;
								}

					$.ajax({
							url: 'vender/update_task_status.php',
							method: 'POST',
							data: {
									id: taskId,
									status: newStatusId
							},
							success: function(response) {
									try {
											var result = JSON.parse(response);
											if (result.status === 'success') {
													ui.draggable.appendTo($this).css({
															top: '0px',
															left: '0px'
													});
													setTimeout(function() {
															location.reload();
													}, 100);
											} else {
													console.error('Ошибка обновления статуса:', result.message);
													alert('Ошибка: ' + result.message);
											}
									} catch (e) {
											console.error('Ошибка парсинга JSON:', e);
											alert('Ошибка обработки ответа сервера.');
									}
							},
							error: function(xhr, status, error) {
									console.error('Ошибка AJAX:', status, error);
									alert('Ошибка при обновлении статуса задачи. Попробуйте снова.');
							}
					});
				}
			});
});
