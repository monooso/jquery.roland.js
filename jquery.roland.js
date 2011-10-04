/**
 * Add and delete 'rows' to any container element.
 *
 * @author      Stephen Lewis (http://github.com/experience/)
 * @copyright   Experience Internet
 * @version     1.1.5
 */

(function($) {

  $.fn.roland = function(options) {
    var opts = $.extend({}, $.fn.roland.defaults, options);

    return this.each(function() {
      var $container = $(this);
      updateIndexes($container, opts);
      updateNav($container, opts);

      // Adds a row.
      $container.find('.' + opts.addRowClass).bind('click', function(e) {
        e.preventDefault();

        var $link       = $(this);
        var $parentRow  = $link.closest('.' + opts.rowClass);
        var $lastRow    = $container.find('.' + opts.rowClass + ':last');
        var $cloneRow   = $lastRow.clone(true);
        var eventData   = {};

        // Reset the field values.
        $cloneRow.find('input').each(function() {
          var type = $(this).attr('type');

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

        $cloneRow.find('select').val('');

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
        typeof $parentRow === 'object'
          ? $parentRow.after($cloneRow) : $lastRow.append($cloneRow);

        // Update everything.
        updateIndexes($container, opts);
        updateNav($container, opts);

        // Post-add event.
        if ($link.data('events').postAddRow !== undefined) {
          eventData = {container : $container, options : opts, newRow : $cloneRow};
          $link.triggerHandler('postAddRow', [eventData]);
        }
      });


      // Removes a row.
      $container.find('.' + opts.removeRowClass).bind('click', function(e) {
        e.preventDefault();

        var $row = $(this).closest('.' + opts.rowClass);

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

  // Updates the indexes of any form elements.
  function updateIndexes($container, opts) {
    $container.find('.' + opts.rowClass).each(function(rowCount) {
      regex = /^([a-z_]+)\[(?:[0-9]+)\](.*)$/;

      $(this).find('input, select, textarea').each(function(fieldCount) {
        $field = $(this);

        if ($field.attr('id')) {
          var fieldId = $field.attr('id')
            .replace(regex, '$1[' + rowCount + ']$2');

          $field.attr('id', fieldId);
        }

        if ($field.attr('name')) {
          var fieldName = $field.attr('name')
            .replace(regex, '$1[' + rowCount + ']$2');

          $field.attr('name', fieldName);
        }
      });
    });
  };

  // Updates the navigation buttons.
  function updateNav($container, opts) {
    var $remove = $container.find('.' + opts.removeRowClass);
    var $rows = $container.find('.' + opts.rowClass);
    $rows.size() == 1 ? $remove.hide() : $remove.show();
  };


})(jQuery);


/* End of file      : jquery.roland.js */
