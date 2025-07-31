<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class saveDepartementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'Nom_depart'=>'required',
            'Descriptif_depart'=>'required',
            'Nom_depart_ar'=>'required',
            'Descriptif_depart_ar'=>'required',

        ];
    }
  /*  public function message()
    {
        [
            'name.required'=>'le nom de la direction est requis',
            'name.unique'=>'le nom de la direction existe deja'
        ]; }*/

}
