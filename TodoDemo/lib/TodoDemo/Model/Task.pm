use strict;
use warnings;

package TodoDemo::Model::Task;
use Jifty::DBI::Schema;
use Method::Signatures::Simple;


use TodoDemo::Record schema {
    column description => type is 'text';
    column done => type is 'boolean';
};

# Your model-specific methods go here.

method api_editable_params {
    return (qw'description done');
}
method api_hash {
    {  id          => $self->id,
       description => $self->description,
       done        => $self->done ? JSON::true : JSON::false }
}


1;

