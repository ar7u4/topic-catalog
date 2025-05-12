$(document).ready(function() {
    // Load data.json and initialize DataTables
    $.ajax({
        url: './data.json',
        dataType: 'json',
        success: function(data) {
            // Initialize Metadata Table
            $('#metadataTable').DataTable({
                data: data.map(item => [
                    item.topic_name,
                    item.platform,
                    item.project,
                    item.schema_file_locations,
                    item.producer_team_spg,
                    item.producer_team_email,
                    item.consumer_team_spg,
                    item.consumer_team_email,
                    item.business_owner
                ]),
                columns: [
                    { title: "Topic Name" },
                    { title: "Platform" },
                    { title: "Project" },
                    { title: "Schema File Locations" },
                    { title: "Producer Team SPG" },
                    { title: "Producer Team Email" },
                    { title: "Consumer Team SPG" },
                    { title: "Consumer Team Email" },
                    { title: "Business Owner" }
                ],
                responsive: true,
                paging: true,
                searching: true,
                ordering: true
            });

            // Initialize tooltips for long text
            $('#metadataTable tbody').on('mouseenter', 'td', function() {
                var cellData = $(this).text();
                if (cellData.length > 20) { // Adjust length as needed
                    $(this).attr('title', cellData);
                    $(this).tooltip({
                        placement: 'top',
                        trigger: 'hover'
                    }).tooltip('show');
                }
            });
        },
        error: function() {
            console.error('Failed to load data.json');
        }
    });

    // Sidebar toggle
    $('#menu-toggle').click(function() {
        $('#sidebar-wrapper').toggleClass('active');
    });

    // Collapse sidebar on hover
    $('#sidebar-wrapper').hover(
        function() {
            $(this).removeClass('collapsed');
        },
        function() {
            $(this).addClass('collapsed');
        }
    );
});
