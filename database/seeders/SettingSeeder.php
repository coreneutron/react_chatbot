<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert(
            [
                [
                    'name' => 'header_title',
                    'value' => 'This is great chat bot!',
                    'type' => 'text'
                ], 
                [
                    'name' => 'header_sentence',
                    'value' => 'I am very happy to develop this auto chat app!',
                    'type' => 'text'
                ], 
                [
                    'name' => 'main_color',
                    'value' => '#162f5c',
                    'type' => 'color'
                ], 
                [
                    'name' => 'bot_text_color',
                    'value' => '#314141',
                    'type' => 'color'
                ], 
                [
                    'name' => 'background_color',
                    'value' => '#ffffff',
                    'type' => 'color'
                ]
            ]
        );
    }
}
