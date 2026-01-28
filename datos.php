<?php

$EmailFrom	 = "webmaster@vmexico.com";
$EmailTo	 = "contacto@uniformeskrisly.com";
$Subject	 = "Mensaje de un visitante de Viviendas Mexico";
$Name		 = Trim( stripslashes( $_POST[ 'nombre' ] ) );
$Phone		 = Trim( stripslashes( $_POST[ 'telefono' ] ) );
$Email		 = Trim( stripslashes( $_POST[ 'email' ] ) );
$Message   	 = Trim( stripslashes( $_POST[ 'mensaje'] ) );


// validation
$validationOK = true;
if ( !$validationOK ) {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=error.htm\">";
	exit;
}

// prepare email body text
$Body = "";
$Body .= "Nombre: ";
$Body .= $Name;
$Body .= "\n";
$Body .= "Telefono: ";
$Body .= $Phone;
$Body .= "\n";
$Body .= "Email: ";
$Body .= $Email;
$Body .= "\n";
$Body .= "Mensaje: ";
$Body .= $Message;



// send email 
$success = mail( $EmailTo, $Subject, $Body, "From: <$EmailFrom>" );

// redirect to success page 
if ( $success ) {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=mensaje_cliente.html\">";
} else {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=error.htm\">";
}
