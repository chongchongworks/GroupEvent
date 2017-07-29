

var ReportLoader = {
    settings: {
        baseUrl: null,
        password: null,
        txtPassword: $('#txtPassword'),
        btnSubmit: $('#btnSubmit'),
        spError: $('#spError'),
        tbReport: $('#tbReport')

    },

    init: function ()
    {
        ReportLoader.settings.spError.val('');
        ReportLoader.settings.tbReport.visible = false;


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
            url: baseUrl + '/api/config',
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
        ReportLoader.settings.btnSubmit.on('click', function ()
        {

        })
    }


}


