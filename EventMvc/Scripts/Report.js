

var ReportLoader = {
    settings: 
    {
        baseUrl: null,
        password: null
    },
    ui:
    {
        txtPassword: $('#txtPassword'),
        btnSubmit: $('#btnSubmit'),
        spError: $('#spError'),
        tbReport: $('#tbReport'),
        divReport: $('#divReport'),
        divPassword: $('#divPassword')
    },

    init: function ()
    {
        ReportLoader.ui.spError.val('');
        ReportLoader.ui.divReport.hide();


        ReportLoader.setBaseUrl();
        ReportLoader.setPassword();


        ReportLoader.bindSubmitButton();
    },

    setBaseUrl: function ()
    {
        var getUrl = window.location;

        // for web api url, include application path
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

        // if localhost, we don't want application path
        if (getUrl.host.indexOf('localhost') >= 0)
            baseUrl = getUrl.protocol + "//" + getUrl.host + "/"

        ReportLoader.settings.baseUrl = baseUrl;
    },
    setPassword: function ()
    {
        $.ajax({
            url: ReportLoader.settings.baseUrl + '/api/config',
            type: 'get',
            async: false,
            success: function (data)
            {
                ReportLoader.settings.password = data.ReportPassword
            },
            error: function (data)
            {
                alert('系统错误，请刷新以后，再试一次');
            }

        });

    },

    bindSubmitButton: function ()
    {
        ReportLoader.ui.btnSubmit.on('click', function ()
        {
            if (ReportLoader.ui.txtPassword.val() == ReportLoader.settings.password)
            {
                ReportLoader.ui.divPassword.hide();
                ReportLoader.ui.divReport.show();
                ReportLoader.LoadCustomers();
                ReportLoader.bindCheckbox();

            }
            else
            {
                ReportLoader.ui.spError.val('Incorrect Password');
            }
        })
    },

    

    bindCheckbox: function ()
    {
        $('table').on('change', '.chk', function ()
        {
            var a = $(this).parent().children('input[type="hidden"]').val();

            
        });


    },

    LoadCustomers: function ()
    {
        $.ajax({
            url: ReportLoader.settings.baseUrl + '/api/customer',
            type: 'get',
            async: true,
            success: function (data)
            {
                for (var i = 0; i < data.length; i++)
                {
                    ReportLoader.ui.tbReport.append('<tr' + (data[i].Paid == 'True' ? ' class="green-backgroup"' : '') + '>' +
                                                        '<td>' + data[i].WechatName + '</td>' +
                                                        '<td>' + data[i].NumberOfPeople + '</td>' +
                                                        '<td>' + data[i].RealName + '</td>' +
                                                        '<td>' + data[i].Mobile + '</td>' +
                                                        '<td>' + data[i].Email + '</td>' +
                                                        '<td>' + data[i].Accommodation + '</td>' +
                                                        '<td>' + '<input type="hidden" value="' + data[i].Guid + '"/>' +
                                                                '<input type="checkbox" class="chk" ' + (data[i].Paid == 'True' ? 'checked' : '') + '/></td>' +
                                                        '<td>' + data[i].Desc + '</td>' +
                                                    '</tr>');
                }
            },
            error: function (data)
            {
                alert('系统错误，请刷新以后，再试一次');
            }

        });
    }

}


