module.exports = function (plop) {
    plop.setGenerator('gitbook', {
        description: 'gitbook is awesome',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Article name?',
            validate: function (value) {
                if ((/.+/).test(value)) { return true; }
                return 'name is required';
            }
        },{
            type: 'confirm',
            name: 'draft',
            message: 'Draft?'
        }],
        actions: function(data) {
            var actions = [];
 
            actions.push({
                type: 'add',
                path: 'articles/{{snakeCase name}}.md',
                templateFile: 'plop/article_template.md'
            });

            if(data.draft) {
                actions.push({
                    type: 'add',
                    path: 'plop/draft_{{snakeCase name}}.md',
                    templateFile: 'plop/summary_template.md'
                });
            } else {
                actions.push({
                    type: 'add',
                    path: 'plop/article_{{snakeCase name}}.md',
                    templateFile: 'plop/summary_template.md'
                });
            }
 
            return actions;
        }
    });
};
