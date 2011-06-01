/**
 * Add and delete 'rows' to any container element.
 *
 * @author			Stephen Lewis
 * @package			Crumbly
 */

(function($) {

    $.fn.roland = function(options) {
        var opts = $.extend({}, $.fn.roland.defaults, options);

        return this.each(function() {
            $container = $(this);
            updateIndexes($container, opts);
            updateNav($container, opts);

            // Compile a list of all the available options for the 'templates' DD.
            var templateOptions = initAvailableOptionsList($container.find('select[name^="templates[0]"]'));

            // Adds a row.
            $container.find('.' + opts.addRowClass).bind('click', function(e) {
                e.preventDefault();

                $link       = $(this);
                $parentRow  = $link.closest('.' + opts.rowClass);
                $lastRow    = $container.find('.' + opts.rowClass + ':last');
                $cloneRow   = $lastRow.clone(true);

                // Reset the field values.
                $cloneRow.find('input').each(function() {
                    type = $(this).attr('type');

                    switch (type.toLowerCase()) {
                        case 'checkbox':
                        case 'radio':
                            $(this).attr('checked', false);
                            break;

                        case 'email':
                        case 'password':
                        case 'search':
                        case 'text':
                            $(this).val('');
                            break;
                    }
                });

                // Pre-add event. Only checks return value from last listener.
                if ($link.data('events').preAddRow !== undefined) {
                    eventData = {container : $container, options : opts, newRow : $cloneRow};
                    $cloneRow = $link.triggerHandler('preAddRow', [eventData]);

                    // Returning FALSE prevents the row being added.
                    if ($cloneRow === false) {
                        return;
                    }
                }

                // If the 'add row' link lives inside a row, insert the new row after it.
                // Otherwise, just tag it on the end.
                typeof $parentRow === 'object' ? $parentRow.after($cloneRow) : $lastRow.append($cloneRow);

                // Post-add event.
                if ($link.data('events').postAddRow !== undefined) {
                    eventData = {container : $container, options : opts};
                    $link.triggerHandler('postAddRow', [eventData]);
                }

                // Update everything.
                updateIndexes($container, opts);
                updateNav($container, opts);
            });


            // Removes a row.
            $container.find('.' + opts.removeRowClass).bind('click', function(e) {
                e.preventDefault();
                $row = $(this).closest('.' + opts.rowClass);

                // Can't remove the last row.
                if ($row.siblings().length == 0) {
                    return false;
                }

                $row.remove();

                // Update everything.
                updateIndexes($container, opts);
                updateNav($container, opts);
            });
        });
    };


    // Defaults.
    $.fn.roland.defaults = {
        rowClass        : 'row',
        addRowClass     : 'add_row',
        removeRowClass  : 'remove_row'
    };


    /* ------------------------------------------
     * PRIVATE METHODS
     * -----------------------------------------*/

    // Initialises the 'available options' list for the specified select field.
    function initAvailableOptionsList($select)
    {
        options = {};
        $select.find('option').each(function() {
            options[$(this).attr('value')] = $(this).text();
        });
        return options;
    }


    // Updates the indexes of any form elements.
	function updateIndexes($container, opts) {
		$container.find('.' + opts.rowClass).each(function(rowCount) {
			regex = /^([a-z_]+)\[(?:[0-9]+)\]\[([a-z_]+)\]$/;

			$(this).find('input, select, textarea').each(function(fieldCount) {
				fieldName	= $(this).attr('name');
				fieldName	= fieldName.replace(regex, '$1[' + rowCount + '][$2]');
				$(this).attr('name', fieldName);
			});

		});
	};

    // Updates the navigation buttons.
	function updateNav($container, opts) {
		$remove = $container.find('.' + opts.removeRowClass);
		$rows	= $container.find('.' + opts.rowClass);
        $rows.size() == 1 ? $remove.hide() : $remove.show();
	};

})(jQuery);


/* End of file      : jquery.roland.js */
/* File location    : themes/third_party/crumbly/js/libs/jquery.roland.js */
