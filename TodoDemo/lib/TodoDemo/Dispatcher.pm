package TodoDemo::Dispatcher;
use Jifty::Dispatcher -base;
use JiftyX::ModelHelpers;

sub api_redirect;
my $API_PREFIX = '/api/1/';

under $API_PREFIX => [

    on GET 'tasks' => run {
       my $tasks = M('TaskCollection');
       $tasks->unlimit();
       rest_serialize_search($tasks);
    },
    on GET 'tasks/#' => run {
        my $id = $1;
       rest_serialize_record('Task', $id);
    },
    on PUT 'tasks/#' => run {
        my $id = $1;
        my $params = json_from_request_body();
        my $task = M('Task');
        $task->load($id);
        for my $attr ($task->api_editable_params) {
            next unless defined $params->{$attr};
            my $setter = "set_$attr";
          $task->$setter($params->{$attr}) unless ($task->$attr eq $params->{$attr});
        }
       rest_serialize_record('Task', $id);
    },


    on POST 'tasks' => run {
        my $task = M('Task');
        my $params = json_from_request_body();
        $task->create( description => $params->{'description'});
        if ($task->id) {
            api_redirect 'tasks/'.$task->id;
        } else {
            json_response('500', 'Something bad happened');

        }

    },
    on DELETE 'tasks/#' => run {
        my $id = $1;
        my $task = M('Task');
        $task->load($id);
        my ($val) = $task->delete();
        if ($val) {
            json_response('200', 'Task deleted');
        } else {
            json_response('500', 'Server error');
        }

    }
    
];

sub api_redirect {
    my $path = shift;
    redirect $API_PREFIX.$path;
}

sub rest_serialize_search {
    my $collection = shift;
    json_response('200', [ map { $_->api_hash} @$collection]); 
}

sub rest_serialize_record {
    my $model_class = shift;
    my $id = shift;
    my $model = M($model_class);
    $model->load($id);
    json_response('200', $model->api_hash);
}


sub json_response {
     my ($code, $obj) = @_;
     Jifty->web->response->content_type('application/json; charset=utf-8');
     Jifty->web->response->status($code);
     Jifty->web->response->body(Jifty::JSON::encode_json($obj));
     last_rule;
}

sub json_from_request_body {
    return unsupported_media_type('Content-Type application/json is required')
        unless Jifty->web->request->header('Content-Type') =~ m/json/i;
    my $body_fh = Jifty->web->request->body;
    my $json_str = do { local $/ = undef; <$body_fh> };
    return bad_request('Missing JSON body') unless length($json_str);
    my $args = eval { Jifty::JSON::decode_json($json_str) };
    return bad_request("Invalid JSON body: $@") if $@;
    return $args;
}


sub bad_request            { textplain_response(400, @_) }
sub forbidden              { textplain_response(403, 'Forbidden') }
sub gone                   { textplain_response(410, 'Gone - deleted') }
sub unsupported_media_type { textplain_response(415, @_) }

sub textplain_response {
    my ($code, $msg) = @_;
    Jifty->web->response->content_type('text/plain; charset=utf-8');
    Jifty->web->response->status($code);
    Jifty->web->response->body($msg);
    last_rule;
    return undef;
}
1;
