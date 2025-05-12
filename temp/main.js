$(function() {
  // Theme switching and other logic is in index.html script

  // Topic Catalog table (AJAX)
  $.getJSON('data-2.json', function(data) {
    var rows = '';
    function formatStacked(val, forModal = false) {
      if (val === undefined || val === null || val === '' || val === '#' || val === '# -') 
        return forModal ? '<div>N/A</div>' : '<div class="ellipsis">N/A</div>';
      
      if (Array.isArray(val)) {
        if (val.length === 0) 
          return forModal ? '<div>N/A</div>' : '<div class="ellipsis">N/A</div>';
        
        if (forModal) {
          return val.map((v, i) => `<div>${v}</div>`).join('');
        } else {
          return val.map((v, i, arr) => `<div class="ellipsis">${v}${i < arr.length - 1 ? ',' : ''}</div>`).join('');
        }
      }
      
      if (typeof val === 'string' && val.includes(',')) {
        var parts = val.split(',');
        if (forModal) {
          return parts.map(v => `<div>${v.trim()}</div>`).join('');
        } else {
          return parts.map((v, i) => `<div class="ellipsis">${v.trim()}${i < parts.length - 1 ? ',' : ''}</div>`).join('');
        }
      }
      
      return forModal ? `<div>${val}</div>` : `<div class="ellipsis">${val}</div>`;
    }
    
    // Table rows with ellipsis
    data.forEach(function(item, idx) {
      rows += '<tr>'
        + `<td><button class="topic-link btn btn-link" data-idx="${idx}" style="color:#007bff;cursor:pointer;text-decoration:underline;padding:0;font-size:inherit;">${formatStacked(item.topic_name)}</button></td>`
        + '<td>' + formatStacked(item.platform) + '</td>'
        + '<td>' + formatStacked(item.project) + '</td>'
        + '<td>' + formatStacked(item.producer_team_spg) + '</td>'
        + '<td>' + formatStacked(item.producer_team_email) + '</td>'
        + '<td>' + formatStacked(item.consumer_team_spg) + '</td>'
        + '<td>' + formatStacked(item.consumer_team_email) + '</td>'
        + '<td>' + formatStacked(item.business_owner) + '</td>'
        + '</tr>';
    });
    $('#example tbody').html(rows);
    var dt = $('#example').DataTable({
      responsive: false,
      autoWidth: false,
      language: {
        emptyTable: "No records found",
        zeroRecords: "No matching records found",
        paginate: {
          first: '<i class="glyphicon glyphicon-step-backward"></i>',
          previous: '<i class="glyphicon glyphicon-chevron-left"></i>',
          next: '<i class="glyphicon glyphicon-chevron-right"></i>',
          last: '<i class="glyphicon glyphicon-step-forward"></i>'
        },
        info: "Showing _START_ to _END_ of _TOTAL_ topics",
        lengthMenu: "Show _MENU_ topics per page"
      },
      dom: '<"top"Blfp>rt<"bottom"ip>',
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      pageLength: 10,
      pagingType: "full_numbers",
      displayLength: 10,
      buttons: [
        {
          extend: 'collection',
          text: '<i class="glyphicon glyphicon-download-alt"></i> Export',
          buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
        }
      ]
    });
    
    // Enhance pagination to show more page numbers
    $.fn.DataTable.ext.pager.numbers_length = 7;

    // Tooltip for all non-empty cells
    $('#example tbody').on('mouseenter', 'td', function() {
      var $cell = $(this);
      var text = $cell.text();
      if (text.trim() !== '') {
        $cell.attr('title', text);
      } else {
        $cell.removeAttr('title');
      }
    });

    // Modal logic for topic details - update to use formatStacked with forModal=true
    $(document).off('click', '.topic-link').on('click', '.topic-link', function() {
      var idx = $(this).data('idx');
      var topic = data[idx];
      // Set modal title
      $('#topicModalLabel').text(topic.topic_name || 'Topic Details');
      // Build modal body with same UI as topic-detail.html
      var html = '';
      html += `<div class='owner-row' style='margin-bottom:18px; border-bottom:1px solid #f4f4f4;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Business Owner</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.business_owner, true)}</span></div>`;
      html += `<div class='topic-detail-row' style='margin-bottom:14px; border-bottom:1px solid #f4f4f4;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Platform</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.platform, true)}</span></div>`;
      html += `<div class='topic-detail-row' style='margin-bottom:14px; border-bottom:1px solid #f4f4f4;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Project</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.project, true)}</span></div>`;
      html += `<div class='side-by-side' style='display:flex;gap:24px;margin-bottom:0;'><div class='producer-col' style='flex:1 1 0;min-width:0;background:#fcfcfc;border-radius:8px;padding:12px 14px 10px 14px;border:1px solid #f4f4f4;'><div class='section-title' style='font-weight:700;color:#222;font-size:1.13rem;margin-bottom:8px;letter-spacing:0.01em;'>Producer</div><div class='topic-detail-row' style='border-bottom:none;margin-bottom:8px;padding-bottom:0;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Team SPG</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.producer_team_spg, true)}</span></div><div class='topic-detail-row' style='border-bottom:none;margin-bottom:8px;padding-bottom:0;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Team Email</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.producer_team_email, true)}</span></div></div><div class='consumer-col' style='flex:1 1 0;min-width:0;background:#fcfcfc;border-radius:8px;padding:12px 14px 10px 14px;border:1px solid #f4f4f4;'><div class='section-title' style='font-weight:700;color:#222;font-size:1.13rem;margin-bottom:8px;letter-spacing:0.01em;'>Consumer</div><div class='topic-detail-row' style='border-bottom:none;margin-bottom:8px;padding-bottom:0;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Team SPG</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.consumer_team_spg, true)}</span></div><div class='topic-detail-row' style='border-bottom:none;margin-bottom:8px;padding-bottom:0;'><span class='topic-detail-label' style='font-weight:700;color:#222;font-size:1.11rem;margin-bottom:2px;letter-spacing:0.01em;'>Team Email</span><span class='topic-detail-value' style='color:#444;font-size:1.08rem;font-weight:400;line-height:1.7;margin-left:2px;word-break:break-word;'>${formatStacked(topic.consumer_team_email, true)}</span></div></div></div>`;
      $('#topic-modal-body').html(html);
      $('#topicModal').modal('show');
    });

    // Direct XLSX Export button handler - more reliable
    $('#export-xlsx').on('click', function() {
      // Create arrays to hold our data
      var rows = [];
      
      // Add headers row
      var headerRow = [];
      $('#example thead th').each(function() {
        headerRow.push($(this).text().trim());
      });
      rows.push(headerRow);
      
      // Add data rows - simple text extraction
      $('#example tbody tr').each(function() {
        var dataRow = [];
        $(this).find('td').each(function() {
          // Get the text content, ignoring HTML
          dataRow.push($(this).text().trim());
        });
        rows.push(dataRow);
      });

      // Convert to worksheet
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.aoa_to_sheet(rows);
      
      // Add to workbook and save
      XLSX.utils.book_append_sheet(wb, ws, "Topics");
      XLSX.writeFile(wb, "topics.xlsx");
    });
  });

  // === Export as JSON ===
  // (Removed, handled by DataTables Buttons)
  // === Export as PDF ===
  // (Removed, handled by DataTables Buttons)
});
