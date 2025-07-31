<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class VerifyCodeController extends Controller
{
    public function showForm()
    {
        return view('auth.verify-code');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $userId = Session::get('user_id_pending_verification');
        $user = User::find($userId);

        if (!$user || $user->verification_code !== $request->code) {
            return back()->withErrors(['code' => 'Code invalide.']);
        }

        $user->email_verified_at = now();
        $user->verification_code = null;
        $user->save();

        Session::forget('user_id_pending_verification');
        auth()->login($user);
       
        return redirect()->route('dashboard'); // 🔁 vers ton tableau de bord
    }
}
