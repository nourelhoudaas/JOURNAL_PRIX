    <?php
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    class CreateDossiersTable extends Migration
    {
        public function up()
        {
            Schema::create('dossiers', function (Blueprint $table) {
                $table->engine = 'InnoDB';
                $table->id('id_dossier');
                $table->dateTime('date_create_dossier');
                $table->string('statut_dossier', 191);
                $table->charset = 'utf8mb4';
                $table->collation = 'utf8mb4_unicode_ci';
            });
        }

        public function down()
        {
            Schema::dropIfExists('dossiers');
        }
    }