<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function bankAccount()
    {
        $s = Setting::where('key', 'bank_account')->first();

        if (! $s) {
            return response()->json(null, 204);
        }

        $value = json_decode($s->value, true);

        return response()->json($value);
    }

    public function index()
    {
        $all = Setting::all()->mapWithKeys(function ($s) {
            $val = json_decode($s->value, true);
            return [$s->key => $val ?? $s->value];
        });

        return response()->json($all);
    }

    public function show($key)
    {
        $s = Setting::where('key', $key)->first();
        if (! $s) {
            return response()->json(['message' => 'Setting not found'], 404);
        }
        $val = json_decode($s->value, true) ?? $s->value;
        return response()->json($val);
    }
}
